/* eslint-disable */
const convict = require('convict');
const dotenv = require('dotenv');

dotenv.config();

const required = (val) => {
    if (val === null) {
        throw new Error('is a mandatory config value.');
    }
};

const config = convict({
    Cognito: {
        Region: {
            doc: 'AWS Cognito Region.',
            format: required,
            default: null,
            env: 'COGNITO_REGION',
        },
        UserPoolId: {
            doc: 'AWS Cognito User Pool Id.',
            format: required,
            default: null,
            env: 'COGNITO_USER_POOL_ID',
        },
        IdentityPoolId: {
            doc: 'AWS Cognito Identity Pool Id.',
            format: required,
            default: null,
            env: 'COGNITO_IDENTITY_POOL_ID',
        },
        ClientId: {
            doc: 'AWS Cognito Client Id.',
            format: required,
            default: null,
            env: 'COGNITO_CLIENT_ID',
        },
    },
});

config.validate({ allowed: 'strict' });

module.exports = () => {
    return { code: 'module.exports = ' + JSON.stringify(config.getProperties()) };
};
