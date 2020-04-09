import { Construct } from '@aws-cdk/core';
import { RestApi, IResource, MethodOptions, LambdaIntegration, JsonSchemaVersion, JsonSchemaType, IModel, AuthorizationType, CorsOptions, EndpointType } from "@aws-cdk/aws-apigateway";
import { IFunction } from "@aws-cdk/aws-lambda";
import { Certificate } from "@aws-cdk/aws-certificatemanager";

import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';

export interface HttpMethod {
    method: string;
    options?: MethodOptions;
}

export class SearchIndexServiceApi {

    public readonly apiGateway: RestApi;
    public readonly requestModel: IModel;
    public readonly responseModel: IModel;

    constructor(stack: Construct, nameSuffix: string, config: { [name: string]: string }) {

        const hostedZoneId = config.HOSTED_ZONE_ID;
        const hostedZoneName = config.HOSTED_ZONE_NAME;
        const certificateArn = config.CERTIFICATE_ARN;
        const domainName = config.API_GATEWAY_DOMAIN_NAME;
        const stageName = config.STAGE_NAME


        const certificate = Certificate.fromCertificateArn(stack, "SearchIndexServiceAPICertificate", certificateArn);

        this.apiGateway = new RestApi(stack, "SearchIndexServiceAPI" + nameSuffix, {
            deployOptions: {
                stageName: stageName
            },
            domainName: {
                domainName: domainName,
                certificate: certificate,
                endpointType: EndpointType.EDGE
            }
        });

        new route53.ARecord(stack, "SearchIndexServiceAPICustomDomainAliasRecord" + nameSuffix, {
            zone: route53.HostedZone.fromHostedZoneAttributes(stack, "SearchIndexServiceHostedZone" + nameSuffix, {
                hostedZoneId: hostedZoneId,
                zoneName: hostedZoneName
            }),
            recordName: domainName,
            target: route53.RecordTarget.fromAlias(new targets.ApiGateway(this.apiGateway))
        });

        // TODO: Authorizer

        this.requestModel = this.apiGateway.addModel('RequestModel', {
            contentType: 'application/json',
            modelName: 'RequestModel',
            schema: {
                schema: JsonSchemaVersion.DRAFT4,
                type: JsonSchemaType.OBJECT,
                required: ["request"],
                properties: {
                    "request": {
                        "type": JsonSchemaType.STRING
                    }
                },
                title: 'Request Schema',
            }
        });

        this.responseModel = this.apiGateway.addModel('ResponseModel', {
            contentType: 'application/json',
            modelName: 'ResponseModel',
            schema: {
                schema: JsonSchemaVersion.DRAFT4,
                type: JsonSchemaType.OBJECT,
                required: ["response"],
                properties: {
                    "response": {
                        "type": JsonSchemaType.STRING
                    }
                },
                title: 'Response Schema',
            }
        });

    }

    public createMethodOptions(authorizationType: AuthorizationType) {
        return {
            authorizationType: authorizationType,
            requestModels: {
                "application/json": this.requestModel
            },
            methodResponses: [{
                statusCode: '200',
                responseModels: {
                    'application/json': this.responseModel
                }
            }],
        };
    }

    public createCorsOptions(statusCode: number, allowOrigins: string) {
        return {
            statusCode: statusCode,
            allowOrigins: [allowOrigins]
        };
    }

    public addMethodOnRoot(resourcePathPart: string, corsOptions: CorsOptions, lambdaHandler: IFunction, httpMethods: HttpMethod[]) {
        const root = this.apiGateway.root;
        return this.addMethod(root, resourcePathPart, corsOptions, lambdaHandler, httpMethods);
    }

    public addMethod(parentResource: IResource, resourcePathPart: string, corsOptions: CorsOptions, lambdaHandler: IFunction, httpMethods: HttpMethod[]) {

        const lambdaIntegration = new LambdaIntegration(lambdaHandler);

        const resource = parentResource.addResource(resourcePathPart);
        httpMethods.forEach(httpMethod => resource.addMethod(httpMethod.method, lambdaIntegration, httpMethod.options));
        resource.addCorsPreflight(corsOptions);

        return resource;
    }

}

/*
SearchIndexServiceAPI:
Type: AWS::Serverless::Api
Properties:
StageName: !Ref EnvParameter
Domain:
DomainName: !Ref DomainNameParameter
CertificateArn: !Ref CertificateParameter
EndpointConfiguration: EDGE
Route53:
  HostedZoneId: !Ref HostedZoneParameter
BasePath:
  - Fn::Sub: /${EnvParameter}
Auth:
DefaultAuthorizer: SearchIndexServiceRequestAuthorizer
Authorizers:
  SearchIndexServiceRequestAuthorizer:
    FunctionPayloadType: REQUEST
    FunctionArn: !GetAtt SearchIndexServiceBasicAuth.Outputs.LambdaAuthorizerBasicAuthFunction
    Identity:
      Headers:
        - Authorization

RootFunction:
Type: AWS::Serverless::Function
Properties:
CodeUri: src/root-function
Handler: app.lambdaHandler
Runtime: nodejs12.x
Events:
Root:
  Type: Api
  Properties:
    Path: /
    Method: get
    RestApiId: !Ref SearchIndexServiceAPI

SearchIndexServiceBasicAuth:
Type: AWS::Serverless::Application
Properties:
Location:
ApplicationId: arn:aws:serverlessrepo:us-east-1:560348900601:applications/lambda-authorizer-basic-auth
SemanticVersion: 0.2.0
*/
