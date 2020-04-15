import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { config } from '../utils/Config';
import { Session } from './Session';

const cognitoUserPool = new CognitoUserPool({
    UserPoolId: config.Cognito.UserPoolId,
    ClientId: config.Cognito.ClientId,
});

export const forgotPasswordCodeRequest = async (email: string): Promise<void> => {
    return await new Promise<void>((resolve, reject) => {
        const user = new CognitoUser({ Username: email, Pool: cognitoUserPool });
        user.forgotPassword({
            onSuccess: () => resolve(),
            onFailure: (err) => reject(err),
        });
    });
};

export const forgotPasswordConfirm = async (email: string, code: string, newPassword: string): Promise<void> => {
    return await new Promise<void>((resolve, reject) => {
        const user = new CognitoUser({ Username: email, Pool: cognitoUserPool });
        user.confirmPassword(code, newPassword, {
            onSuccess: () => resolve(),
            onFailure: (err) => reject(err),
        });
    });
};

export const changePassword = async (session: Session, password: string, newPassword: string): Promise<void> => {
    return await new Promise<void>((resolve, reject) => {
        const { user } = session;
        user.changePassword(password, newPassword, (err?: Error) => {
            if (err) reject(err);
            else resolve();
        });
    });
};
