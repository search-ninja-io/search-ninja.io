/* eslint import/no-webpack-loader-syntax: off */
// eslint-disable-next-line import/no-unresolved
import * as loadedConfig from '!val-loader!./ConfigLoader';

export interface Config {
    Cognito: {
        Region: string;
        UserPoolId: string;
        IdentityPoolId: string;
        ClientId: string;
    };
}

export const config = loadedConfig as Config;
