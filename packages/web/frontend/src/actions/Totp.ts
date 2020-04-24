import { Store } from 'use-global-hook';
import { State } from '../state';
import { Actions } from '.';

import { Auth } from 'aws-amplify';
import { useHistory } from '../history';

export type TotpActions = {
    isTotpEnabled: () => Promise<boolean>;
    enableTotp: () => Promise<void>;
    disableTotp: () => Promise<void>;
    setupTotp: () => Promise<string>;
    verifyTotpToken: (verificationCode: string) => Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isTotpEnabled = async (store: Store<State, Actions>): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        console.log('Actions.isTotpEnabled()');
        try {
            const currentCognitoUser = await Auth.currentAuthenticatedUser({ bypassCache: false });
            if (!currentCognitoUser) throw new Error('No user is logged in to change password.');

            const preferredMFA = await Auth.getPreferredMFA(currentCognitoUser, { bypassCache: false });

            resolve(preferredMFA === 'SOFTWARE_TOKEN_MFA');
        } catch (err) {
            reject(err);
        }
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const enableTotp = async (store: Store<State, Actions>): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.enableTotp()');
        try {
            const currentCognitoUser = await Auth.currentAuthenticatedUser({ bypassCache: false });
            if (!currentCognitoUser) throw new Error('No user is logged in to change password.');

            await Auth.setPreferredMFA(currentCognitoUser, 'TOTP');

            resolve();
        } catch (err) {
            reject(err);
        }
    });
};

export const disableTotp = async (store: Store<State, Actions>): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.disableTotp()');
        try {
            const currentCognitoUser = await Auth.currentAuthenticatedUser({ bypassCache: false });
            if (!currentCognitoUser) throw new Error('No user is logged in to change password.');

            await Auth.setPreferredMFA(currentCognitoUser, 'NOMFA');
            await store.actions.signOut();

            useHistory().push('/login');

            resolve();
        } catch (err) {
            reject(err);
        }
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const setupTotp = async (store: Store<State, Actions>): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
        console.log('Actions.setupTotp()');
        try {
            const currentCognitoUser = await Auth.currentAuthenticatedUser({ bypassCache: false });
            if (!currentCognitoUser) throw new Error('No user is logged in to change password.');

            const { attributes } = currentCognitoUser;
            const email = attributes['email'];
            const code = await Auth.setupTOTP(currentCognitoUser);

            resolve('otpauth://totp/Search%20Ninja:' + email + '?secret=' + code + '&issuer=Search%20Ninja');
        } catch (err) {
            reject(err);
        }
    });
};

export const verifyTotpToken = async (store: Store<State, Actions>, verificationCode: string): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.setupTotpVerifyToken()');
        try {
            const currentCognitoUser = await Auth.currentAuthenticatedUser({ bypassCache: false });
            if (!currentCognitoUser) throw new Error('No user is logged in to change password.');

            await Auth.verifyTotpToken(currentCognitoUser, verificationCode);
            await enableTotp(store);
            await store.actions.signOut();

            useHistory().push('/login');

            resolve();
        } catch (err) {
            reject(err);
        }
    });
};
