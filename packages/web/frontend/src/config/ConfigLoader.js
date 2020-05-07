/* eslint-disable */
const convict = require('convict');
const dotenv = require('dotenv');

dotenv.config();

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
    Cognito: {
        Region: {
            doc: 'AWS Cognito Region',
            format: required,
            default: null,
            env: 'COGNITO_REGION',
        },
        IdentityPoolId: {
            doc: 'AWS Cognito Identity Pool Id.',
            format: required,
            default: null,
            env: 'COGNITO_IDENTITY_POOL_ID',
        },
    },
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
    },
});

config.validate({ allowed: 'strict' });

module.exports = () => {
    return { code: 'module.exports = ' + JSON.stringify(config.getProperties()) };
};
