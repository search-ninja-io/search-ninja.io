import { Store } from 'use-global-hook';
import { State } from '../state';
import { Actions } from '.';

import { Auth } from 'aws-amplify';
import { useHistory } from '../history';

export type ChangePasswordActions = {
    changePassword: (password: string, newPassword: string) => Promise<boolean>;
};

export const changePassword = async (
    store: Store<State, Actions>,
    oldPassword: string,
    newPassword: string,
): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        console.log('Actions.changePassword()');
        try {
            const currentCognitoUser = await Auth.currentAuthenticatedUser({ bypassCache: false });
            if (!currentCognitoUser) throw new Error('No user is logged in to change password.');

            await Auth.changePassword(currentCognitoUser, oldPassword, newPassword);
            await store.actions.signOut();

            useHistory().push('/login');

            resolve();
        } catch (err) {
            reject(err);
        }
    });
};
