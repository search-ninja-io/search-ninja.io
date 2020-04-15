import { CognitoUser } from 'amazon-cognito-identity-js';
import { Session, getSession } from './Session';
import { saveIdentityPoolCredentials } from './IdentityPool';

export interface MfaResult {
    session: Session;
}

export const sendSoftwareToken = async (
    user: CognitoUser,
    softwareToken: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rememberDevice: boolean,
): Promise<MfaResult> => {
    return await new Promise<MfaResult>((resolve, reject) => {
        user.sendMFACode(
            softwareToken,
            {
                onFailure: (err) => reject(err),
                onSuccess: async () => {
                    await getSession()
                        .then(async (session: Session) => await saveIdentityPoolCredentials(session))
                        // TODO: Implement "rememberDevice" with MFA
                        //.then(async (session: Session) => await saveDeviceStatus(session, rememberDevice))
                        .then((session: Session) => resolve({ session: session }))
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
                    associateSecretCode: (secret) => {
                        const email = session.userAttributes['email'];
                        resolve(
                            'otpauth://totp/Search%20Ninja:' + email + '?secret=' + secret + '&issuer=Search%20Ninja',
                        );
                    },
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
                        session.user.setUserMfaPreference(null, softwareTokenMfaSettings, (err) => {
                            if (err) reject(err);
                            else {
                                const attributes = [{ Name: 'custom:mfa', Value: deviceName }];
                                session.user.updateAttributes(attributes, (err) => {
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
                session.user.setUserMfaPreference(null, softwareTokenMfaSettings, (err) => {
                    if (err) reject(err);
                    else {
                        const attributes = [{ Name: 'custom:mfa', Value: '' }];
                        session.user.updateAttributes(attributes, (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            })
            .catch((err) => reject(err));
    });
};
