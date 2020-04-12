import { Construct, Duration } from '@aws-cdk/core';
import {
    UserPool,
    VerificationEmailStyle,
    CfnUserPoolClient,
    CfnUserPoolDomain,
    CfnIdentityPool,
    CfnIdentityPoolRoleAttachment,
    CfnUserPoolIdentityProvider,
    CfnUserPool,
    Mfa,
} from '@aws-cdk/aws-cognito';
import { HostedZone, ARecord, RecordTarget } from '@aws-cdk/aws-route53';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';

import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { Role, PolicyStatement, Effect, FederatedPrincipal } from '@aws-cdk/aws-iam';

import * as path from 'path';

export class SearchNinjaAuth {
    constructor(stack: Construct, nameSuffix: string, config: { [name: string]: string }) {
        // TODO: Set correct policies for API Gateway

        const region = config.REGION;
        const cloudFrontHostedZoneId = config.COGNITO_AUTH_CLOUDFRONT_HOSTED_ZONE_ID;
        const hostedZoneId = config.HOSTED_ZONE_ID;
        const hostedZoneName = config.HOSTED_ZONE_NAME;
        const certificateArn = config.CERTIFICATE_ARN;
        const domainName = config.COGNITO_AUTH_DOMAIN_NAME;

        const emailFrom = config.COGNITO_AUTH_EMAIL_FROM;
        const emailReplyTo = config.COGNITO_AUTH_EMAIL_REPLY_TO;
        const emailSourceArn = config.COGNITO_AUTH_EMAIL_SOURCE_ARN;

        const userPoolAllowedAuthScopes = config.COGNITO_AUTH_USER_POOL_ALLOWED_AUTH_SCOPES.split(' ');

        const googleClientId = config.COGNITO_AUTH_GOOGLE_CLIENT_ID;
        const googleClientSecret = config.COGNITO_AUTH_GOOGLE_CLIENT_SECRET;
        const googleClientAuthorizeScopes = config.COGNITO_AUTH_GOOGLE_CLIENT_AUTHORIZE_SCOPES;
        const googleCallbackUrls = config.COGNITO_AUTH_GOOGLE_CALLBACK_URLS.split(' ');
        const googleLogoutUrls = config.COGNITO_AUTH_GOOGLE_LOGOUT_URLS.split(' ');

        const lambdaPath = path.resolve(__dirname, '../lambda');

        const customMessageFunction = new Function(stack, 'CustomMessageFunction' + nameSuffix, {
            runtime: Runtime.NODEJS_12_X,
            handler: 'index.customMessageHandler',
            code: Code.fromAsset(lambdaPath),
            environment: {
                USER_POOL_DOMAIN: 'https://' + domainName,
            },
        });

        const preSignUpFunction = new Function(stack, 'PreSignUpFunction' + nameSuffix, {
            runtime: Runtime.NODEJS_12_X,
            handler: 'index.preSignUpHandler',
            code: Code.fromAsset(lambdaPath),
        });

        const userPool = new UserPool(stack, 'UserPool' + nameSuffix, {
            autoVerify: {
                email: true,
                phone: false,
            },
            requiredAttributes: {
                email: true,
                phoneNumber: false,
                fullname: true,
            },
            selfSignUpEnabled: true,
            mfa: Mfa.OPTIONAL,
            mfaSecondFactor: {
                otp: true,
                sms: true,
            },
            signInAliases: {
                email: true,
                phone: false,
                username: false,
            },
            lambdaTriggers: {
                customMessage: customMessageFunction,
                preSignUp: preSignUpFunction,
            },
            userVerification: {
                emailStyle: VerificationEmailStyle.LINK,
            },
            passwordPolicy: {
                minLength: 8,
                requireDigits: true,
                requireLowercase: true,
                requireSymbols: false, // non-default
                requireUppercase: true,
                tempPasswordValidity: Duration.days(7),
            },
            userPoolName: 'SearchNinjaCognitoUserPool' + nameSuffix,
        });

        const cfnUserPool = userPool.node.defaultChild as CfnUserPool;
        cfnUserPool.emailConfiguration = {
            emailSendingAccount: 'DEVELOPER',
            from: emailFrom,
            replyToEmailAddress: emailReplyTo,
            sourceArn: emailSourceArn,
        };
        cfnUserPool.accountRecoverySetting = {
            recoveryMechanisms: [
                {
                    name: 'verified_email',
                    priority: 1,
                },
            ],
        };

        const supportedIdentityProviders = ['COGNITO'];
        const userPoolIdentityProviderGoogleIdp = new CfnUserPoolIdentityProvider(
            stack,
            'UserPoolIdentityProviderGoogleIdP',
            {
                providerType: 'Google',
                providerName: 'Google',
                providerDetails: {
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    client_id: googleClientId,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    client_secret: googleClientSecret,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    authorize_scopes: googleClientAuthorizeScopes,
                },
                attributeMapping: {
                    username: 'sub',
                    email: 'email',
                    name: 'name',
                },
                userPoolId: userPool.userPoolId,
            },
        );
        supportedIdentityProviders.push(userPoolIdentityProviderGoogleIdp.providerName);

        const cfnUserPoolClient = new CfnUserPoolClient(stack, 'UserPoolClient' + nameSuffix, {
            supportedIdentityProviders: supportedIdentityProviders,
            clientName: 'Web',
            allowedOAuthFlowsUserPoolClient: true,
            allowedOAuthFlows: ['code'],
            allowedOAuthScopes: userPoolAllowedAuthScopes,
            preventUserExistenceErrors: 'ENABLED',
            generateSecret: false,
            refreshTokenValidity: 1,
            callbackUrLs: googleCallbackUrls,
            logoutUrLs: googleLogoutUrls,
            userPoolId: userPool.userPoolId,
        });
        cfnUserPoolClient.addDependsOn(userPoolIdentityProviderGoogleIdp);

        const cfnUserPoolDomain = new CfnUserPoolDomain(stack, 'UserPoolDomain' + nameSuffix, {
            userPoolId: userPool.userPoolId,
            domain: domainName,
            customDomainConfig: {
                certificateArn: certificateArn,
            },
        });

        const describeCognitoUserPoolDomain = new AwsCustomResource(stack, 'DescribeCognitoUserPoolDomain', {
            resourceType: 'Custom::DescribeCognitoUserPoolDomain',
            onCreate: {
                region: region,
                service: 'CognitoIdentityServiceProvider',
                action: 'describeUserPoolDomain',
                parameters: {
                    Domain: cfnUserPoolDomain.domain,
                },
                physicalResourceId: PhysicalResourceId.of(cfnUserPoolDomain.domain),
            },
            policy: AwsCustomResourcePolicy.fromSdkCalls({
                resources: AwsCustomResourcePolicy.ANY_RESOURCE,
            }),
        });
        describeCognitoUserPoolDomain.node.addDependency(cfnUserPoolDomain);

        const userPoolDomainDistribution = describeCognitoUserPoolDomain.getResponseField(
            'DomainDescription.CloudFrontDistribution',
        );

        const userPoolDomainAliasRecord = new ARecord(stack, 'UserPoolDomainAliasRecord', {
            recordName: cfnUserPoolDomain.domain,
            target: RecordTarget.fromAlias({
                // TODO - Check this, if it is really working
                // bind: (record: IRecordSet) => ({
                bind: () => ({
                    hostedZoneId: cloudFrontHostedZoneId,
                    dnsName: userPoolDomainDistribution,
                }),
            }),
            zone: HostedZone.fromHostedZoneAttributes(stack, 'HostedAuthZone' + nameSuffix, {
                hostedZoneId: hostedZoneId,
                zoneName: hostedZoneName,
            }),
        });
        userPoolDomainAliasRecord.node.addDependency(cfnUserPoolDomain);

        const identityPool = new CfnIdentityPool(stack, 'IdentityPool' + nameSuffix, {
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [
                {
                    clientId: cfnUserPoolClient.ref,
                    providerName: userPool.userPoolProviderName,
                },
            ],
            supportedLoginProviders: {
                'accounts.google.com': googleClientId,
            },
        });

        const unauthenticatedRole = new Role(stack, 'UnauthRole', {
            assumedBy: new FederatedPrincipal(
                'cognito-identity.amazonaws.com',
                {
                    StringEquals: {
                        'cognito-identity.amazonaws.com:aud': identityPool.ref,
                    },
                    'ForAnyValue:StringLike': {
                        'cognito-identity.amazonaws.com:amr': 'unauthenticated',
                    },
                },
                'sts:AssumeRoleWithWebIdentity',
            ),
        });
        unauthenticatedRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['mobileanalytics:PutEvents', 'cognito-sync:*'],
                resources: ['*'],
            }),
        );
        const authenticatedRole = new Role(stack, 'AuthRole', {
            assumedBy: new FederatedPrincipal(
                'cognito-identity.amazonaws.com',
                {
                    StringEquals: {
                        'cognito-identity.amazonaws.com:aud': identityPool.ref,
                    },
                    'ForAnyValue:StringLike': {
                        'cognito-identity.amazonaws.com:amr': 'authenticated',
                    },
                },
                'sts:AssumeRoleWithWebIdentity',
            ),
        });

        authenticatedRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['mobileanalytics:PutEvents', 'cognito-sync:*', 'cognito-identity:*'],
                resources: ['*'],
            }),
        );
        new CfnIdentityPoolRoleAttachment(stack, 'DefaultValid', {
            identityPoolId: identityPool.ref,
            roles: {
                unauthenticated: unauthenticatedRole.roleArn,
                authenticated: authenticatedRole.roleArn,
            },
        });
    }
}
