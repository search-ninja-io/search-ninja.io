import { Store } from 'use-global-hook';
import { State } from '../state';
import { Actions } from '.';

import { Auth } from 'aws-amplify';
import { useHistory } from '../history';

export type SignUpActions = {
    signUp: (username: string, name: string, password: string) => Promise<void>;
};

export const signUp = async (
    store: Store<State, Actions>,
    username: string,
    name: string,
    password: string,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.signUp()', username, name);
        try {
            await Auth.signUp({
                username: username,
                password: password,
                attributes: {
                    name: name,
                },
            });
            await store.actions.signOut();

            useHistory().push('/login');

            resolve();
        } catch (err) {
            reject(err);
        }
    });
};
