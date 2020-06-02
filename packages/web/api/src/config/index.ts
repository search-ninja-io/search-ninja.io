export enum NavType {
    DOC = 'DOC',
    API = 'API',
    DIVIDER = 'DIVIDER',
}

export interface Nav {
    Key: string;
    Name: string;
    Type: NavType;
}

export interface NavDivider extends Nav {
    Type: NavType.DIVIDER;
}

export interface NavDocument extends Nav {
    Type: NavType.DOC;
    Url: string;
    Navigation: Nav[];
}

export interface NavApi extends Nav {
    Type: NavType.API;
    SwaggerUrl: string;
    Navigation: Nav[];
}

export interface Config {
    Auth0: {
        Domain: string;
        ClientId: string;
        Audience: string;
        Scope: string;
        ResponseType: string;
        CacheLocation: string;
    };
    Navigation: Nav[];
}

const mapConfig = (navs: Nav[], path: string): Map<string, Nav> => {
    const result = new Map<string, Nav>();
    navs.forEach((nav) => {
        const mapKey = (path.endsWith('/') ? path.substring(0, path.length - 1) : path) + '/' + nav.Key;
        if (nav.Type === NavType.API) {
            const navApi = nav as NavApi;
            result.set(mapKey, nav);
            if (navApi.Navigation) {
                mapConfig(navApi.Navigation, mapKey).forEach((value, key) => result.set(key, value));
            }
        }
        if (nav.Type === NavType.DOC) {
            const navDoc = nav as NavDocument;
            result.set(mapKey, nav);
            if (navDoc.Navigation) {
                mapConfig(navDoc.Navigation, mapKey).forEach((value, key) => result.set(key, value));
            }
        }
    });
    return result;
};

export let config: Config;
export let configMap: Map<string, Nav>;

export const load = async (): Promise<Config> => {
    return fetch('/config.json')
        .then((result) => result.json())
        .then((newconfig) => {
            config = newconfig;
            return config;
        })
        .then((config) => {
            configMap = mapConfig(config.Navigation, '');
            return config;
        })
        .catch((err) => {
            throw err;
        });
};
