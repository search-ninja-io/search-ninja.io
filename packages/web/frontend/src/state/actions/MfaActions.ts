import { Store } from 'use-global-hook';
import { SessionState } from '../SessionStore';
import * as Auth from '../../auth/Auth';
import { SessionActions } from '../SessionActions';
import { logout } from './LogoutActions';

export const sendSoftwareToken = async (store: Store<SessionState, SessionActions>, mfaCode: string): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('SessionActions.sendSoftwareToken()');
        if (!store.state.totpSession) {
            reject('Temporary credentials cannot be extracted, please try again.');
            return;
        }
        const { user, rememberDevice } = store.state.totpSession;

        await Auth.sendSoftwareToken(user, mfaCode, rememberDevice)
            .then((mfaResult) => {
                const state = {
                    session: mfaResult.session,
                    totpSession: undefined,
                    messages: undefined,
                };
                store.setState(state, () => resolve());
            })
            .catch((err) => reject(err));
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchMfaDevice = async (store: Store<SessionState, SessionActions>): Promise<string> => {
    console.log('SessionActions.fetchMfaDevice()');
    return new Promise<string>(async (resolve, reject) => {
        await Auth.getMfaDevice()
            .then((mfaDevice) => resolve(mfaDevice))
            .catch((err) => reject(err));
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const associateSoftwareToken = async (store: Store<SessionState, SessionActions>): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
        console.log('SessionActions.associateSoftwareToken()');
        await Auth.associateSoftwareToken()
            .then((data) => resolve(data))
            .catch((err) => reject(err));
    });
};

export const verifySoftwareToken = async (
    store: Store<SessionState, SessionActions>,
    verificationCode: string,
    deviceName: string,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('SessionActions.verifySoftwareToken()');
        await Auth.verifySoftwareToken(verificationCode, deviceName)
            .then(() => logout(store))
            .then(() => resolve())
            .catch((err) => reject(err));
    });
};

export const disableMfaDevice = async (store: Store<SessionState, SessionActions>): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('SessionActions.disableMfaDevice()');
        await Auth.disableMfaDevice()
            .then(() => logout(store))
            .then(() => resolve())
            .catch((err) => reject(err));
    });
};
