export interface Config {
    Cognito: {
        Region: string;
        UserPoolId: string;
        IdentityPoolId: string;
        ClientId: string;
    };
}
