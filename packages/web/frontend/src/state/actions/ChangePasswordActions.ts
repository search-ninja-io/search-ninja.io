import { Store } from 'use-global-hook';
import { SessionState } from '../SessionStore';
import * as Auth from '../../auth/Auth';
import { SessionActions } from '../SessionActions';
import { logout } from './LogoutActions';
import { setSuccess } from './MessageActions';

export const changePassword = async (
    store: Store<SessionState, SessionActions>,
    password: string,
    newPassword: string,
): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        console.log('SessionActions.changePassword()');
        const { session } = store.state;
        if (!session) reject('No user is logged in to change password.');
        else {
            await Auth.changePassword(session, password, newPassword)
                .then(() => logout(store))
                .then(() => resolve())
                .catch((err) => reject(err));
        }
    });
};
