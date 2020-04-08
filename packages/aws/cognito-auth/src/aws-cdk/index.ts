import { Construct, CfnOutput, Duration } from "@aws-cdk/core";
import { UserPool, VerificationEmailStyle, CfnUserPoolClient, CfnUserPoolDomain, CfnIdentityPool, CfnIdentityPoolRoleAttachment, CfnUserPoolIdentityProvider, CfnUserPool, UserPoolClient, Mfa } from "@aws-cdk/aws-cognito";
import { HostedZone, ARecord, RecordTarget } from "@aws-cdk/aws-route53";
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from "@aws-cdk/custom-resources";

import { Function, Runtime, Code } from "@aws-cdk/aws-lambda";
import { Role, PolicyStatement, Effect, FederatedPrincipal } from "@aws-cdk/aws-iam";

import * as path from "path";

export class SearchNinjaAuth {

    constructor(stack: Construct, nameSuffix: string, stageName: string) {

        // TODO: Externalize config
        // TODO: Set correct policies for API Gateway

        const region = "us-east-1";
        const cloudFrontHostedZoneId = "Z2FDTNDATAQYW2";
        const hostedZoneId = "Z046596619KNOH1A62M10";
        const hostedZoneName = "search-ninja.io";
        const certificateArn = "arn:aws:acm:us-east-1:402774754291:certificate/449d81c6-05bb-4a28-a38b-2f69abdbb9da";
        const domainName = (stageName === "prod" ? "auth.search-ninja.io" : "auth-" + stageName + ".search-ninja.io");

        const emailFrom = "Search Ninja <support@search-ninja.io>";
        const emailReplyTo = "no-reploy@search-ninja.io";
        const emailSourceArn = "arn:aws:ses:us-east-1:402774754291:identity/support@search-ninja.io";

        const userPoolAllowedAuthScopes = ["email", "openid", "profile"];

        const googleClientId = "337904865128-hq181tkp1ictqeigusk3pmocapi66tqn.apps.googleusercontent.com";
        const googleClientSecret = "J7OFWP_E3M9ptPJwP6-tu1h8";
        const googleClientAuthorizeScopes = "email openid profile";
        const googleCallbackUrls = ["http://localhost:3000/"];
        const googleLogoutUrls = ["http://localhost:3000/logout"];

        const lambdaPath = path.resolve(__dirname, "../lambda");

        const customMessageFunction = new Function(stack, "CustomMessageFunction" + nameSuffix, {
            runtime: Runtime.NODEJS_12_X,
            handler: 'index.customMessageHandler',
            code: Code.fromAsset(lambdaPath),
            environment: {
                USER_POOL_DOMAIN: "https://" + domainName
            }
        });

        const preSignUpFunction = new Function(stack, "PreSignUpFunction" + nameSuffix, {
            runtime: Runtime.NODEJS_12_X,
            handler: 'index.preSignUpHandler',
            code: Code.fromAsset(lambdaPath),
        });

        const userPool = new UserPool(stack, "UserPool" + nameSuffix, {
            autoVerify: {
                email: true,
                phone: false
            },
            requiredAttributes: {
                email: true,
                phoneNumber: false,
                fullname: true
            },
            selfSignUpEnabled: true,
            mfa: Mfa.OPTIONAL,
            mfaSecondFactor: {
                otp: true,
                sms: true
            },
            signInAliases: {
                email: true,
                phone: false,
                username: false
            },
            lambdaTriggers: {
                customMessage: customMessageFunction,
                preSignUp: preSignUpFunction,
            },
            userVerification: {
                emailStyle: VerificationEmailStyle.LINK
            },
            passwordPolicy: {
                minLength: 8,
                requireDigits: true,
                requireLowercase: true,
                requireSymbols: false, // non-default
                requireUppercase: true,
                tempPasswordValidity: Duration.days(7)
            },
            userPoolName: "SearchNinjaCognitoUserPool" + nameSuffix
        });

        const cfnUserPool = userPool.node.defaultChild as CfnUserPool;
        cfnUserPool.emailConfiguration = {
            emailSendingAccount: "DEVELOPER",
            from: emailFrom,
            replyToEmailAddress: emailReplyTo,
            sourceArn: emailSourceArn
        };
        cfnUserPool.accountRecoverySetting = {
            recoveryMechanisms: [{
                name: "verified_email",
                priority: 1
            }]
        };

        const supportedIdentityProviders = ["COGNITO"];
        const userPoolIdentityProviderGoogleIdp = new CfnUserPoolIdentityProvider(stack, "UserPoolIdentityProviderGoogleIdP", {
            providerType: "Google",
            providerName: "Google",
            providerDetails: {
                client_id: googleClientId,
                client_secret: googleClientSecret,
                authorize_scopes: googleClientAuthorizeScopes
            },
            attributeMapping: {
                username: "sub",
                email: "email",
                name: "name"
            },
            userPoolId: userPool.userPoolId
        });
        supportedIdentityProviders.push(userPoolIdentityProviderGoogleIdp.providerName);

        const cfnUserPoolClient = new CfnUserPoolClient(stack, "UserPoolClient" + nameSuffix, {
            supportedIdentityProviders: supportedIdentityProviders,
            clientName: "Web",
            allowedOAuthFlowsUserPoolClient: true,
            allowedOAuthFlows: ["code"],
            allowedOAuthScopes: userPoolAllowedAuthScopes,
            generateSecret: false,
            refreshTokenValidity: 1,
            callbackUrLs: googleCallbackUrls,
            logoutUrLs: googleLogoutUrls,
            userPoolId: userPool.userPoolId
        });
        cfnUserPoolClient.addDependsOn(userPoolIdentityProviderGoogleIdp);

        const cfnUserPoolDomain = new CfnUserPoolDomain(stack, "UserPoolDomain" + nameSuffix, {
            userPoolId: userPool.userPoolId,
            domain: domainName,
            customDomainConfig: {
                certificateArn: certificateArn
            },
        });

        const describeCognitoUserPoolDomain = new AwsCustomResource(
            stack,
            "DescribeCognitoUserPoolDomain",
            {
                resourceType: "Custom::DescribeCognitoUserPoolDomain",
                onCreate: {
                    region: region,
                    service: "CognitoIdentityServiceProvider",
                    action: "describeUserPoolDomain",
                    parameters: {
                        Domain: cfnUserPoolDomain.domain,
                    },
                    physicalResourceId: PhysicalResourceId.of(cfnUserPoolDomain.domain),
                },
                policy: AwsCustomResourcePolicy.fromSdkCalls({
                    resources: AwsCustomResourcePolicy.ANY_RESOURCE,
                }),
            }
        );
        describeCognitoUserPoolDomain.node.addDependency(cfnUserPoolDomain);

        const userPoolDomainDistribution = describeCognitoUserPoolDomain.getResponseField(
            "DomainDescription.CloudFrontDistribution"
        );

        new ARecord(stack, "UserPoolDomainAliasRecord", {
            recordName: cfnUserPoolDomain.domain,
            target: RecordTarget.fromAlias({
                bind: (_record: any) => ({
                    hostedZoneId: cloudFrontHostedZoneId,
                    dnsName: userPoolDomainDistribution,
                }),
            }),
            zone: HostedZone.fromHostedZoneAttributes(stack, "HostedAuthZone" + nameSuffix, {
                hostedZoneId: hostedZoneId,
                zoneName: hostedZoneName
            }),
        });

        const identityPool = new CfnIdentityPool(stack, "IdentityPool" + nameSuffix, {
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [
                {
                    clientId: cfnUserPoolClient.ref,
                    providerName: userPool.userPoolProviderName
                }
            ],
            supportedLoginProviders: {
                "accounts.google.com": googleClientId
            }

        });

        const unauthenticatedRole = new Role(stack, "UnauthRole", {
            assumedBy: new FederatedPrincipal("cognito-identity.amazonaws.com", {
                "StringEquals": { "cognito-identity.amazonaws.com:aud": identityPool.ref },
                "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "unauthenticated" },
            }, "sts:AssumeRoleWithWebIdentity"),
        });
        unauthenticatedRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                "mobileanalytics:PutEvents",
                "cognito-sync:*"
            ],
            resources: ["*"],
        }));
        const authenticatedRole = new Role(stack, "AuthRole", {
            assumedBy: new FederatedPrincipal("cognito-identity.amazonaws.com", {
                "StringEquals": { "cognito-identity.amazonaws.com:aud": identityPool.ref },
                "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "authenticated" },
            }, "sts:AssumeRoleWithWebIdentity"),
        });

        authenticatedRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                "mobileanalytics:PutEvents",
                "cognito-sync:*",
                "cognito-identity:*"
            ],
            resources: ["*"],
        }));
        const defaultPolicy = new CfnIdentityPoolRoleAttachment(stack, "DefaultValid", {
            identityPoolId: identityPool.ref,
            roles: {
                'unauthenticated': unauthenticatedRole.roleArn,
                'authenticated': authenticatedRole.roleArn
            }
        });
    }

}

