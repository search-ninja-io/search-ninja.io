import {
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute,
    CognitoUserPool,
    CognitoUserSession,
} from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import { config } from './Config';

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
            reject('No user session found');
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

export interface MfaResult {
    session: Session;
}

export const sendSoftwareToken = async (user: CognitoUser, softwareToken: string): Promise<MfaResult> => {
    return await new Promise<MfaResult>((resolve, reject) => {
        user.sendMFACode(
            softwareToken,
            {
                onFailure: (err) => reject(err),
                onSuccess: async () => {
                    await getSession()
                        .then((session) => {
                            AWS.config.region = config.Cognito.Region;
                            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                                IdentityPoolId: config.Cognito.IdentityPoolId,
                                Logins: {
                                    ['cognito-idp.' +
                                    config.Cognito.Region +
                                    '.amazonaws.com/' +
                                    config.Cognito.UserPoolId]: session.cognitoSession.getIdToken().getJwtToken(),
                                },
                            });
                            (AWS.config.credentials as AWS.CognitoIdentityCredentials).refresh((err) =>
                                err ? reject(err) : resolve({ session: session }),
                            );
                        })
                        .catch((err) => reject(err));
                },
            },
            'SOFTWARE_TOKEN_MFA',
        );
    });
};

export const associateSoftwareToken = async (): Promise<string> => {
    return await new Promise<string>((resolve, reject) => {
        getSession()
            .then((session) => {
                session.user.associateSoftwareToken({
                    onFailure: (err) => reject(err),
                    associateSecretCode: (secret) =>
                        resolve(
                            'otpauth://totp/Search%20Ninja:' +
                                session.userAttributes['email'] +
                                '?secret=' +
                                secret +
                                '&issuer=Search%20Ninja',
                        ),
                });
            })
            .catch((err) => reject(err));
    });
};

export const verifySoftwareToken = async (totpVerificationCode: string, deviceName: string): Promise<void> => {
    return await new Promise<void>((resolve, reject) => {
        getSession()
            .then((session) => {
                session.user.verifySoftwareToken(totpVerificationCode, deviceName, {
                    onFailure: (err) => reject(err),
                    onSuccess: () => {
                        const softwareTokenMfaSettings = { Enabled: true, PreferredMfa: true };
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        session.user.setUserMfaPreference(null, softwareTokenMfaSettings, (err, data) => {
                            if (err) reject(err);
                            else {
                                const attributes = [{ Name: 'custom:mfa', Value: deviceName }];
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                session.user.updateAttributes(attributes, (err, data) => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            }
                        });
                    },
                });
            })
            .catch((err) => reject(err));
    });
};

export const getMfaDevice = async (): Promise<string> => {
    return await new Promise<string>((resolve, reject) => {
        getSession()
            .then((session) => {
                const mfaDevice = session.userAttributes['custom:mfa'];
                resolve(mfaDevice);
            })
            .catch((err) => reject(err));
    });
};

export const disableMfaDevice = async (): Promise<string> => {
    return await new Promise<string>((resolve, reject) => {
        getSession()
            .then((session) => {
                const softwareTokenMfaSettings = { Enabled: false, PreferredMfa: false };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                session.user.setUserMfaPreference(null, softwareTokenMfaSettings, (err, data) => {
                    if (err) reject(err);
                    else {
                        const attributes = [{ Name: 'custom:mfa', Value: '' }];
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        session.user.updateAttributes(attributes, (err, data) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            })
            .catch((err) => reject(err));
    });
};

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
}

export const login = async (
    username: string,
    password: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                });
            },
            onSuccess: async () =>
                await getSession()
                    .then((session) => {
                        AWS.config.region = config.Cognito.Region;
                        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                            IdentityPoolId: config.Cognito.IdentityPoolId,
                            Logins: {
                                ['cognito-idp.' +
                                config.Cognito.Region +
                                '.amazonaws.com/' +
                                config.Cognito.UserPoolId]: session.cognitoSession.getIdToken().getJwtToken(),
                            },
                        });
                        (AWS.config.credentials as AWS.CognitoIdentityCredentials).refresh((err) =>
                            err ? reject(err) : resolve({ type: 'LoginResult', session: session }),
                        );
                    })
                    .catch((err) => reject(err)),

            /*
            newPasswordRequired: (userAttributes: any, requiredAttributes: any) => {
                console.log('Auth.login.newPasswordRequired', userAttributes, requiredAttributes);
                reject('newPasswordRequired --> Not Yet Implemented');
            },
            mfaRequired: (challengeName: any, challengeParameters: any) => {
                console.log('Auth.login.mfaRequired', challengeName, challengeParameters);
                reject('mfaRequired --> Not Yet Implemented');
            },
            customChallenge: (challengeParameters: any) => {
                console.log('Auth.login.customChallenge', challengeParameters);
                reject('customChallenge --> Not Yet Implemented');
            },
            mfaSetup: (challengeName: any, challengeParameters: any) => {
                console.log('Auth.login.mfaSetup', challengeName, challengeParameters);
                reject('mfaSetup --> Not Yet Implemented');
            },
            selectMFAType: (challengeName: any, challengeParameters: any) => {
                console.log('Auth.login.selectMFAType', challengeName, challengeParameters);
                reject('selectMFAType --> Not Yet Implemented');
            },
            */
        });
    });
};

export const logout = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return await new Promise<void>((resolve, reject) => {
        const user = cognitoUserPool.getCurrentUser();
        if (user) {
            user.signOut();
        }
        resolve();
    });
};

export const signup = async (email: string, name: string, password: string): Promise<void> => {
    return await new Promise<void>((resolve, reject) => {
        const userAttributes = [
            new CognitoUserAttribute({
                Name: 'name',
                Value: name,
            }),
        ];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        cognitoUserPool.signUp(email, password, userAttributes, [], (err, data) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        user.changePassword(password, newPassword, (err?: Error, result?: string) => {
            if (err) reject(err);
            else resolve();
        });
    });
};
