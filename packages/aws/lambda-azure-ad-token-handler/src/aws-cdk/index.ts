import { Function, Runtime, Code } from "@aws-cdk/aws-lambda";
import { ResourceOptions, LambdaIntegrationOptions, AuthorizationType } from "@aws-cdk/aws-apigateway";
import { Construct } from "@aws-cdk/core";

import * as path from "path";

import { SearchIndexServiceApi, HttpMethod } from "@search-ninja-aws/api-gateway";

export class AzureAdTokenHandlerFunction {
    constructor(stack: Construct, searchIndexServiceApi: SearchIndexServiceApi, nameSuffix: string) {

        const lambdaPath = path.resolve(__dirname, "../lambda");

        const azureAdTokenHandler = new Function(stack, "AzureADTokenHandler" + nameSuffix, {
            runtime: Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: Code.fromAsset(lambdaPath)
        });

        const corsOptions = searchIndexServiceApi.createCorsOptions(200, "*");
        //const iamMethod = searchIndexServiceApi.createMethodOptions(AuthorizationType.IAM);
        const anonymousMethod = searchIndexServiceApi.createMethodOptions(AuthorizationType.NONE);

        searchIndexServiceApi.addMethodOnRoot("token", corsOptions, azureAdTokenHandler,
            [
                { method: "ANY", options: anonymousMethod }
            ]);

    }
}
