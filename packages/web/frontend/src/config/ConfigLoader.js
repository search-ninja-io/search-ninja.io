/* eslint-disable */
const convict = require('convict');
const dotenv = require('dotenv');

dotenv.config({
    path: '../config/.env',
});

const required = (val) => {
    if (val === null) {
        throw new Error('is a mandatory config value.');
    }
};

const requiredArray = (val) => {
    if (val === null) {
        throw new Error('is a mandatory config value.');
    }
    return val.split(' ');
};

const config = convict({
    Auth0: {
        Domain: {
            doc: 'Auth0 Domain.',
            format: required,
            default: null,
            env: 'AUTH0_DOMAIN',
        },
        ClientId: {
            doc: 'Auth0 Client Id.',
            format: required,
            default: null,
            env: 'AUTH0_CLIENT_ID',
        },
        ResponseType: {
            doc: 'Auth0 Response Type.',
            format: required,
            default: null,
            env: 'AUTH0_RESPONSE_TYPE',
        },
        Audience: {
            doc: 'Auth0 Audience.',
            format: String,
            default: undefined,
            env: 'AUTH0_AUDIENCE',
        },
        Scope: {
            doc: 'Auth0 Scope.',
            format: String,
            default: undefined,
            env: 'AUTH0_SCOPE',
        },
        CacheLocation: {
            doc: 'Auth0 Cache Location (memory, localstorage, undefined).',
            format: String,
            default: undefined,
            env: 'AUTH0_CACHE_LOCATION',
        },
    },
});

config.validate({ allowed: 'strict' });

module.exports = () => {
    return { code: 'module.exports = ' + JSON.stringify(config.getProperties()) };
};
