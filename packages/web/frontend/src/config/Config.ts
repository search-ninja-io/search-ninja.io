import * as loadedConfig from './ConfigLoader';
import Amplify from 'aws-amplify';

console.log('Config.initializer');

export const config = loadedConfig as loadedConfig.Config;

Amplify.configure({
    Auth: {
        identityPoolId: config.Cognito.IdentityPoolId,
        region: config.Cognito.Region,
        userPoolId: config.Cognito.UserPoolId,
        userPoolWebClientId: config.Cognito.ClientId,
        oauth: {
            domain: config.Cognito.OAuth.Domain,
            scope: config.Cognito.OAuth.Scope,
            redirectSignIn: config.Cognito.OAuth.RedirectSignIn,
            redirectSignOut: config.Cognito.OAuth.RedirectSignOut,
            responseType: config.Cognito.OAuth.ResponseType,
        },

        /* 
        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: false,

        // OPTIONAL - Configuration for cookie storage
        // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        cookieStorage: {
            // REQUIRED - Cookie domain (only required if cookieStorage is provided)
            domain: '.yourdomain.com',
            // OPTIONAL - Cookie path
            path: '/',
            // OPTIONAL - Cookie expiration in days
            expires: 365,
            // OPTIONAL - Cookie secure flag
            // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
            secure: true,
        },

        // OPTIONAL - customized storage object
        storage: new MyStorage(),

        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        authenticationFlowType: 'USER_PASSWORD_AUTH',

        // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
        clientMetadata: { myCustomKey: 'myCustomValue' },

        // OPTIONAL - Hosted UI configuration
        oauth: {
            domain: 'your_cognito_domain',
            scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
            redirectSignIn: 'http://localhost:3000/',
            redirectSignOut: 'http://localhost:3000/',
            responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
        },
*/
    },
});
