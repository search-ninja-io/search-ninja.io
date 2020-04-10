/* eslint import/no-webpack-loader-syntax: off */
import * as loadedConfig from "!val-loader!./ConfigLoader";

export interface IConfig {
    Cognito: {
        Region: string;
        UserPoolId: string;
        IdentityPoolId: string;
        ClientId: string;
    };
}

export const config = loadedConfig as IConfig;
