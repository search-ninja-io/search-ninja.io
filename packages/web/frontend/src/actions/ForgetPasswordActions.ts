import { Store } from 'use-global-hook';
import { State } from '../store';
import * as Auth from '../auth/Auth';
import { Actions } from '.';
import { logout } from './LogoutActions';

export type ForgetPasswordActions = {
    forgotPasswordCodeRequest: (email: string) => Promise<void>;
    forgotPasswordConfirm: (email: string, code: string, newPassword: string) => Promise<void>;
};

export const forgotPasswordCodeRequest = async (store: Store<State, Actions>, email: string): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.forgotPasswordCodeRequest()', email);
        await Auth.forgotPasswordCodeRequest(email)
            .then(() => resolve())
            .catch((err) => reject(err));
    });
};

export const forgotPasswordConfirm = async (
    store: Store<State, Actions>,
    email: string,
    code: string,
    newPassword: string,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.forgotPasswordConfirm()', email);
        await Auth.forgotPasswordConfirm(email, code, newPassword)
            .then(() => logout(store))
            .then(() => resolve())
            .catch((err) => reject(err));
    });
};
