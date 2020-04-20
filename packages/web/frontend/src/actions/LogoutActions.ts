import { Store } from 'use-global-hook';
import { State } from '../store';
import * as Auth from '../auth/Auth';
import { Actions } from '.';

export type LogoutActions = {
    logout: () => Promise<void>;
};

export const logout = async (store: Store<State, Actions>): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        console.log('Actions.logout()');
        Auth.logout()
            .then(() => store.setState({ session: undefined, messages: undefined }, () => resolve()))
            .catch((err) => reject(err));
    });
};
