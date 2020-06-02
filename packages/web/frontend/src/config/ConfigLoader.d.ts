export interface Config {
    Auth0: {
        Domain: string;
        ClientId: string;
        ResponseType: string;
        Audience: string | undefined;
        Scope: string | undefined;
        CacheLocation: 'memory' | 'localstorage' | undefined;
    };
}
