import { Store } from 'use-global-hook';
import { SessionState } from '../SessionStore';
import * as Auth from '../../auth/Auth';
import { SessionActions } from './SessionActions';
import { logout } from './LogoutActions';

export const changePassword = async (
    store: Store<SessionState, SessionActions>,
    password: string,
    newPassword: string,
): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        console.log('SessionActions.changePassword()');
        const { session } = store.state;
        if (!session) {
            console.error('SessionActions.changePassword() - Error -> No user is logged in to change password');
            reject('No user is logged in to change password.');
            return;
        }
        await Auth.changePassword(session, password, newPassword)
            .then(() => console.log('SessionActions.changePassword() - Success'))
            .then(() => logout(store))
            .then(() => resolve())
            .catch((err) => {
                console.error('SessionActions.changePassword() - Error', err);
                reject(err);
            });
    });
};
