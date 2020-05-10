import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { AuthorizationType } from '@aws-cdk/aws-apigateway';
import { Construct } from '@aws-cdk/core';

import * as path from 'path';

import { SearchIndexServiceApi } from '@search-ninja-aws/api-gateway';

export class SearchNinjaAuth {
    constructor(stack: Construct, searchNinjaApi: SearchIndexServiceApi, nameSuffix: string) {
        const lambdaPath = path.resolve(__dirname, '../lambda');

        const authHandler = new Function(stack, 'AuthHandler' + nameSuffix, {
            runtime: Runtime.NODEJS_12_X,
            handler: 'server.handler',
            code: Code.fromAsset(lambdaPath),
            environment: {
                RUNTIME_LAMBDA: 'true',
            },
        });

        const corsOptions = searchNinjaApi.createCorsOptions(200, '*');
        //const iamMethod = searchIndexServiceApi.createMethodOptions(AuthorizationType.IAM);
        const anonymousMethod = searchNinjaApi.createMethodOptions(AuthorizationType.NONE);

        searchNinjaApi.addMethodOnRoot('auth', corsOptions, authHandler, [{ method: 'ANY', options: anonymousMethod }]);
    }
}
