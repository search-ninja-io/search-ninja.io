import { CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { config } from '../utils/Config';

const cognitoUserPool = new CognitoUserPool({
    UserPoolId: config.Cognito.UserPoolId,
    ClientId: config.Cognito.ClientId,
});

export const signup = async (email: string, name: string, password: string): Promise<void> => {
    return await new Promise<void>((resolve, reject) => {
        const userAttributes = [
            new CognitoUserAttribute({
                Name: 'name',
                Value: name,
            }),
        ];
        cognitoUserPool.signUp(email, password, userAttributes, [], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};
