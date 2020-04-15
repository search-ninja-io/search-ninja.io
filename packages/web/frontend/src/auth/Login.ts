import { CognitoUser, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';
import { config } from '../utils/Config';
import { Session, getSession } from './Session';
import { saveIdentityPoolCredentials } from './IdentityPool';

const cognitoUserPool = new CognitoUserPool({
    UserPoolId: config.Cognito.UserPoolId,
    ClientId: config.Cognito.ClientId,
});

export interface LoginResultBase {
    readonly type: 'LoginResult' | 'LoginResultTotpRequired';
}

export interface LoginResult extends LoginResultBase {
    readonly type: 'LoginResult';
    session: Session;
}

export interface LoginResultTotpRequired extends LoginResultBase {
    readonly type: 'LoginResultTotpRequired';
    user: CognitoUser;
    device: string;
    rememberDevice: boolean;
}

export const login = async (
    username: string,
    password: string,
    rememberDevice: boolean,
): Promise<LoginResult | LoginResultTotpRequired> => {
    return await new Promise<LoginResult | LoginResultTotpRequired>((resolve, reject) => {
        const user = new CognitoUser({ Username: username, Pool: cognitoUserPool });
        const authDetails = new AuthenticationDetails({ Username: username, Password: password });
        user.authenticateUser(authDetails, {
            onFailure: (err) => reject(err),
            totpRequired: async (challengeName: string, challengeParameters: { FRIENDLY_DEVICE_NAME: string }) => {
                resolve({
                    type: 'LoginResultTotpRequired',
                    user: user,
                    device: challengeParameters.FRIENDLY_DEVICE_NAME,
                    rememberDevice: rememberDevice,
                });
            },
            onSuccess: async () => {
                await getSession() //)
                    .then(async (session: Session) => await saveIdentityPoolCredentials(session))
                    // TODO: Implement "rememberDevice" with Username / Password only
                    // .then(async (session: Session) => await saveDeviceStatus(session, rememberDevice))
                    .then((session: Session) => resolve({ type: 'LoginResult', session: session }))
                    .catch((err) => reject(err));
            },

            // TODO: Implement "New Password Required"
            /*
            newPasswordRequired: (userAttributes: any, requiredAttributes: any) => {
                console.log('Auth.login.newPasswordRequired', userAttributes, requiredAttributes);
                reject('newPasswordRequired --> Not Yet Implemented');
            },
            */
        });
    });
};
