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
        OAuth: {
            Domain: {
                doc: 'AWS Cognito OAuth Domain.',
                format: required,
                default: null,
                env: 'COGNITO_OAUTH_DOMAIN',
            },
            Scope: {
                doc: 'AWS Cognito OAuth Scope.',
                format: requiredArray,
                default: null,
                env: 'COGNITO_OAUTH_SCOPE',
            },
            RedirectSignIn: {
                doc: 'AWS Cognito OAuth Redirect Sign In.',
                format: required,
                default: null,
                env: 'COGNITO_OAUTH_REDIRECT_SIGN_IN',
            },
            RedirectSignOut: {
                doc: 'AWS Cognito OAuth Redirect Sign Out.',
                format: required,
                default: null,
                env: 'COGNITO_OAUTH_REDIRECT_SIGN_OUT',
            },
            ResponseType: {
                doc: 'AWS Cognito OAuth Respone Type.',
                format: required,
                default: null,
                env: 'COGNITO_OAUTH_RESPONSE_TYPE',
            },
        }
    },
});

config.validate({ allowed: 'strict' });

module.exports = () => {
    return { code: 'module.exports = ' + JSON.stringify(config.getProperties()) };
};
