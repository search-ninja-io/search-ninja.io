import { Store } from 'use-global-hook';
import { SessionState } from '../SessionStore';
import * as Auth from '../../auth/Auth';
import { SessionActions } from './SessionActions';
import { logout } from './LogoutActions';

export const forgotPasswordCodeRequest = async (
    store: Store<SessionState, SessionActions>,
    email: string,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('SessionActions.forgotPasswordCodeRequest()', email);
        await Auth.forgotPasswordCodeRequest(email)
            .then(() => console.log('SessionActions.forgotPasswordCodeRequest() - Success'))
            .then(() => resolve())
            .catch((err) => {
                console.error('SessionActions.forgotPasswordCodeRequest() - Error', err);
                reject(err);
            });
    });
};

export const forgotPasswordConfirm = async (
    store: Store<SessionState, SessionActions>,
    email: string,
    code: string,
    newPassword: string,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('SessionActions.forgotPasswordConfirm()', email);
        await Auth.forgotPasswordConfirm(email, code, newPassword)
            .then(() => console.log('SessionActions.forgotPasswordConfirm() - Success'))
            .then(() => logout(store))
            .then(() => resolve())
            .catch((err) => {
                console.error('SessionActions.forgotPasswordConfirm() - Error', err);
                reject(err);
            });
    });
};
