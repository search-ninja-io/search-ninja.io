import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { Construct, Stack, StackProps, App } from '@aws-cdk/core';
import { SearchNinjaAuth } from '@search-ninja-aws/cognito-auth';
//import { SearchIndexServiceApi } from "@search-ninja-aws/api-gateway";
//import { AzureAdTokenHandlerFunction } from "@search-ninja-aws/lambda-azure-ad-token-handler";

const config = dotenvExpand(dotenv.config()).parsed || {};

class SearchNinjaStack extends Stack {
    constructor(scope: Construct, id: string, nameSuffix: string, props?: StackProps) {
        super(scope, id, props);

        new SearchNinjaAuth(this, nameSuffix, config);
        //const searchIndexServiceApiStack = new SearchIndexServiceApi(this, nameSuffix, nameSuffix.toLowerCase());
        //new AzureAdTokenHandlerFunction(this, searchIndexServiceApiStack, nameSuffix);
    }
}

const app = new App();
const stageName = config.STAGE_NAME;
const nameSuffix = stageName[0].toUpperCase() + stageName.slice(1);
new SearchNinjaStack(app, 'SearchNinjaStack' + nameSuffix, nameSuffix);
app.synth();
