import { Store } from 'use-global-hook';
import { State } from '../state';
import { Actions } from '.';

import { Auth } from 'aws-amplify';
import { useHistory } from '../history';

export type SignOutActions = {
    signOut: () => Promise<void>;
};

export const signOut = async (store: Store<State, Actions>): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.signOut()');
        try {
            await Auth.signOut();

            store.setState({ isAuthenticated: false, currentUserDetails: undefined, message: undefined });

            useHistory().push('/');

            resolve();
        } catch (err) {
            reject(err);
        }
    });
};
