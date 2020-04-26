export interface Config {
    Cognito: {
        Region: string;
        UserPoolId: string;
        IdentityPoolId: string;
        ClientId: string;
        OAuth: {
            Domain: string;
            Scope: string[];
            RedirectSignIn: string;
            RedirectSignOut: string;
            ResponseType: string;
        };
    };
}
