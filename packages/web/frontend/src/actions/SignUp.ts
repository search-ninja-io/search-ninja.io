import { Store } from 'use-global-hook';
import { State } from '../state';
import { Actions } from '.';

import { Auth } from 'aws-amplify';
import { useHistory } from '../history';

export type SignUpActions = {
    signUp: (email: string, name: string, password: string) => Promise<void>;
};

export const signUp = async (
    store: Store<State, Actions>,
    email: string,
    name: string,
    password: string,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.signUp()', email, name);
        try {
            await Auth.signUp(email, name, password);
            await store.actions.signOut();

            useHistory().push('/login');

            resolve();
        } catch (err) {
            reject(err);
        }
    });
};
