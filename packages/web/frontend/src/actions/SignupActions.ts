import { Store } from 'use-global-hook';
import { State } from '../store';
import * as Auth from '../auth';
import { Actions } from '.';
import { logout } from './LogoutActions';

export type SignupActions = {
    signup: (email: string, name: string, password: string) => Promise<void>;
};

export const signup = async (
    store: Store<State, Actions>,
    email: string,
    name: string,
    password: string,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.signup()', email, name);
        await Auth.signup(email, name, password)
            .then(() => logout(store))
            .then(() => resolve())
            .catch((err) => reject(err));
    });
};
