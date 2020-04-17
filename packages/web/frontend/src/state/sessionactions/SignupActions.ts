import { Store } from 'use-global-hook';
import { SessionState } from '../SessionStore';
import * as Auth from '../../auth/Auth';
import { SessionActions } from './SessionActions';
import { logout } from './LogoutActions';

export const signup = async (
    store: Store<SessionState, SessionActions>,
    email: string,
    name: string,
    password: string,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('SessionActions.signup()', email, name);
        await Auth.signup(email, name, password)
            .then(() => console.log('SessionActions.signup() - Success'))
            .then(() => logout(store))
            .then(() => resolve())
            .catch((err) => {
                console.error('SessionActions.signup() - Error', err);
                reject(err);
            });
    });
};
