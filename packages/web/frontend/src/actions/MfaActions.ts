import { Store } from 'use-global-hook';
import { State } from '../store';
import * as Auth from '../auth';
import { Actions } from '.';
import { logout } from './LogoutActions';

export type MfaActions = {
    fetchMfaDevice: () => Promise<string>;
    sendSoftwareToken: (mfaCode: string) => Promise<void>;
    associateSoftwareToken: () => Promise<string>;
    verifySoftwareToken: (verificationCode: string, deviceName: string) => Promise<void>;
    disableMfaDevice: () => Promise<void>;
    cancelMfa: () => void;
};

export const sendSoftwareToken = async (store: Store<State, Actions>, mfaCode: string): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.sendSoftwareToken()');
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
export const fetchMfaDevice = async (store: Store<State, Actions>): Promise<string> => {
    console.log('Actions.fetchMfaDevice()');
    return new Promise<string>(async (resolve, reject) => {
        await Auth.getMfaDevice()
            .then((mfaDevice) => resolve(mfaDevice))
            .catch((err) => reject(err));
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const associateSoftwareToken = async (store: Store<State, Actions>): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
        console.log('Actions.associateSoftwareToken()');
        await Auth.associateSoftwareToken()
            .then((data) => resolve(data))
            .catch((err) => reject(err));
    });
};

export const verifySoftwareToken = async (
    store: Store<State, Actions>,
    verificationCode: string,
    deviceName: string,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.verifySoftwareToken()');
        await Auth.verifySoftwareToken(verificationCode, deviceName)
            .then(() => logout(store))
            .then(() => resolve())
            .catch((err) => reject(err));
    });
};

export const disableMfaDevice = async (store: Store<State, Actions>): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.disableMfaDevice()');
        await Auth.disableMfaDevice()
            .then(() => logout(store))
            .then(() => resolve())
            .catch((err) => reject(err));
    });
};

export const cancelMfa = (store: Store<State, Actions>): void => {
    console.log('Actions.cancelMfa()');
    const state = {
        messages: undefined,
        totpSession: undefined,
    };
    store.setState(state);
};
