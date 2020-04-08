import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { SearchNinjaAuth as SearchNinjaAuth } from "@search-ninja-aws/cognito-auth";
//import { SearchIndexServiceApi } from "@search-ninja-aws/api-gateway";
//import { AzureAdTokenHandlerFunction } from "@search-ninja-aws/lambda-azure-ad-token-handler";

export class SearchNinjaStack extends Stack {
    constructor(scope: Construct, id: string, nameSuffix: string, props?: StackProps) {
        super(scope, id, props);

        new SearchNinjaAuth(this, nameSuffix, nameSuffix.toLowerCase());

        //const searchIndexServiceApiStack = new SearchIndexServiceApi(this, nameSuffix, nameSuffix.toLowerCase());
        //new AzureAdTokenHandlerFunction(this, searchIndexServiceApiStack, nameSuffix);

    }
}
