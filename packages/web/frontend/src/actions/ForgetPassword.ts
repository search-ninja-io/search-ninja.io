import { Store } from 'use-global-hook';
import { State } from '../state';
import { Actions } from '.';

import { Auth } from 'aws-amplify';
import { useHistory } from '../history';

export type ForgetPasswordActions = {
    forgotPassword: (username: string) => Promise<void>;
    forgotPasswordSubmit: (username: string, code: string, newPassword: string) => Promise<void>;
};

export const forgotPassword = async (store: Store<State, Actions>, username: string): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.forgotPassword()', username);
        try {
            await Auth.forgotPassword(username);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
};

export const forgotPasswordSubmit = async (
    store: Store<State, Actions>,
    username: string,
    code: string,
    newPassword: string,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.forgotPasswordSubmit()', username);
        try {
            await Auth.forgotPasswordSubmit(username, code, newPassword);
            await store.actions.signOut();

            useHistory().push('/login');

            resolve();
        } catch (err) {
            reject(err);
        }
    });
};
