import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { config } from '../utils/Config';

const cognitoUserPool = new CognitoUserPool({
    UserPoolId: config.Cognito.UserPoolId,
    ClientId: config.Cognito.ClientId,
});

export const logout = async (): Promise<void> => {
    return await new Promise<void>((resolve) => {
        const user = cognitoUserPool.getCurrentUser();
        if (user) {
            user.signOut();
        }
        resolve();
    });
};
