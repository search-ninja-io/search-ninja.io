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
            await Auth.currentAuthenticatedUser({ bypassCache: false })
                .then(() => {
                    console.log('Actions.signOut() - Execute Auth.signOut()');
                    Auth.signOut();
                })
                .catch((err) => {
                    console.log('Actions.signOut() -', err);
                });

            if (store.state.isAuthenticated || store.state.currentUserDetails) {
                console.log('Actions.signOut() - Update authentication state');
                store.setState({ isAuthenticated: false, currentUserDetails: undefined, message: undefined });
            }

            console.log('Actions.signOut() - Redirect');
            useHistory().push('/');

            resolve();
        } catch (err) {
            reject(err);
        }
    });
};
