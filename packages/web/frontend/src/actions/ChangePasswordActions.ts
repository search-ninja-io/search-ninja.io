import { Store } from 'use-global-hook';
import { State } from '../store';
import { logout } from './LogoutActions';
import { Actions } from '.';
import Auth from '../auth';

export type ChangePasswordActions = {
    changePassword: (password: string, newPassword: string) => Promise<boolean>;
};

export const changePassword = async (
    store: Store<State, Actions>,
    password: string,
    newPassword: string,
): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        console.log('Actions.changePassword()');
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
