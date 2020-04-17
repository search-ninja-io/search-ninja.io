import { Store } from 'use-global-hook';
import { SessionState } from '../SessionStore';
import * as Auth from '../../auth/Auth';
import { SessionActions } from './SessionActions';

export const sendSoftwareToken = async (store: Store<SessionState, SessionActions>, mfaCode: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        console.log('SessionActions.verifyToken()');
        if (!store.state.totpSession) {
            reject('Temporary credentials cannot be extracted, please try again.');
            return;
        }
        const { user, rememberDevice } = store.state.totpSession;

        Auth.sendSoftwareToken(user, mfaCode, rememberDevice)
            .then((mfaResult) => {
                const { session } = mfaResult;
                console.log('SessionActions.verifyToken() - Success / Clear Temp Session');
                store.setState({ session: session, totpSession: undefined }, () => resolve());
            })
            .catch((err) => {
                console.error('SessionActions.verifyToken() - Error', err);
                reject(err);
            });
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchMfaDevice = async (store: Store<SessionState, SessionActions>): Promise<string> => {
    console.log('SessionActions.fetchMfaDevice()');
    return new Promise<string>(async (resolve, reject) => {
        await Auth.getMfaDevice()
            .then((mfaDevice) => {
                console.log('SessionActions.fetchMfaDevice() - Success', mfaDevice);
                resolve(mfaDevice);
            })
            .catch((err) => {
                console.error('SessionActions.fetchMfaDevice() - Error', err);
                reject(err);
            });
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const associateSoftwareToken = async (store: Store<SessionState, SessionActions>): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
        console.log('SessionActions.associateSoftwareToken()');
        await Auth.associateSoftwareToken()
            .then((data) => {
                console.log('SessionActions.associateSoftwareToken() - Success', data);
                resolve(data);
            })
            .catch((err) => {
                console.error('SessionActions.associateSoftwareToken() - Error', err);
                reject(err);
            });
    });
};

export const verifySoftwareToken = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    store: Store<SessionState, SessionActions>,
    verificationCode: string,
    deviceName: string,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('SessionActions.verifySoftwareToken()');
        await Auth.verifySoftwareToken(verificationCode, deviceName)
            .then(() => {
                console.log('SessionActions.verifySoftwareToken() - Success');
                resolve();
            })
            .catch((err) => {
                console.error('SessionActions.verifySoftwareToken() - Error', err);
                reject(err);
            });
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const disableMfaDevice = async (store: Store<SessionState, SessionActions>): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('SessionActions.disableMfaDevice()');
        await Auth.disableMfaDevice()
            .then(() => {
                console.log('SessionActions.disableMfaDevice() - Success');
                resolve();
            })
            .catch((err) => {
                console.error('SessionActions.disableMfaDevice() - Error', err);
                reject(err);
            });
    });
};
