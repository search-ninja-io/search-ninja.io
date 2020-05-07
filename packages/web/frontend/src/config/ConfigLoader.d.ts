export interface Config {
    Cognito: {
        Region: string;
        IdentityPoolId: string;
    };
    Auth0: {
        Domain: string;
        ClientId: string;
    };
}
