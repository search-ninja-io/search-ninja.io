import { CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { config } from '../utils/Config';

const cognitoUserPool = new CognitoUserPool({
    UserPoolId: config.Cognito.UserPoolId,
    ClientId: config.Cognito.ClientId,
});

export interface Session {
    user: CognitoUser;
    cognitoSession: CognitoUserSession;
    userAttributes: UserAttributes;
}

export interface UserAttributes {
    [name: string]: string;
}

export const getSession = async (): Promise<Session> => {
    return await new Promise<Session>((resolve, reject) => {
        const user = cognitoUserPool.getCurrentUser();

        if (!user) {
            reject('No loggedin user found');
            return;
        }

        user.getSession(async (err: Error, session: CognitoUserSession) => {
            if (err) {
                reject(err);
                return;
            }

            const attributes = await new Promise<UserAttributes>((resolve, reject) => {
                user.getUserAttributes((err?: Error, attributes?: CognitoUserAttribute[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const results: UserAttributes = {};
                    (attributes || []).forEach((attr) => (results[attr.getName()] = attr.getValue()));

                    resolve(results);
                });
            });

            resolve({
                user: user,
                cognitoSession: session,
                userAttributes: attributes,
            });
        });
    });
};
