require('dotenv').config({ silent: true });

const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const util = require('util');

const getPolicyDocument = (effect, resource) => {
    const policyDocument = {
        Version: '2012-10-17', // default version
        Statement: [
            {
                Action: 'execute-api:Invoke', // default action
                Effect: effect,
                Resource: resource,
            },
        ],
    };
    return policyDocument;
};

const getTokenAuthorizer = (event) => {
    if (!event.type || event.type !== 'TOKEN') {
        throw new Error('Expected "event.type" parameter to have value "TOKEN"');
    }

    const tokenString = event.authorizationToken;
    if (!tokenString) {
        throw new Error('Expected "event.authorizationToken" parameter to be set');
    }

    const match = tokenString.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
        throw new Error(`Invalid Authorization token - ${tokenString} does not match "Bearer .*"`);
    }
    return match[1];
};

const getTokenHttpRequest = (event) => {
    if (!event.httpMethod || event.httpMethod !== 'GET') {
        throw new Error('Expected "event.httpMethod" parameter to have value "GET"');
    }

    const tokenString = event.headers.Authorization;
    if (!tokenString) {
        throw new Error('Expected "event.headers.Authorization" parameter to be set');
    }

    const match = tokenString.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
        throw new Error(`Invalid Authorization token - ${tokenString} does not match "Bearer .*"`);
    }
    return match[1];
};

const jwtOptions = {
    audience: process.env.AUDIENCE,
    issuer: process.env.TOKEN_ISSUER,
};

const client = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: process.env.JWKS_URI,
});

const decode = (token) => {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new Error('invalid token');
    }
    return decoded;
};

const verify = (token, client, decoded) => {
    const getSigningKey = util.promisify(client.getSigningKey);
    return getSigningKey(decoded.header.kid).then((key) => {
        const signingKey = key.publicKey || key.rsaPublicKey;
        return jwt.verify(token, signingKey, jwtOptions);
    });
};

module.exports.authenticate = (event, context, callback) => {
    console.log('Event', event);
    console.log('Context', context);

    if (event.httpMethod === 'GET') {
        try {
            const token = getTokenHttpRequest(event);
            const decoded = decode(token);
            return verify(token, client, decoded).then((decoded) => {
                return callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(decoded, null, 2),
                });
            });
        } catch (error) {
            return callback(null, {
                statusCode: 401,
                body: JSON.stringify({ message: 'Unauthorized' }, null, 2),
            });
        }
    } else {
        const token = getTokenAuthorizer(event);
        const decoded = decode(token);
        return verify(token, client, decoded).then((decoded) => {
            return {
                principalId: decoded.sub,
                policyDocument: getPolicyDocument('Allow', event.methodArn),
                context: { scope: decoded.scope },
            };
        });
    }
};
