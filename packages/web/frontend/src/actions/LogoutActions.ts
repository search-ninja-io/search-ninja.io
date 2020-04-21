import { Store } from 'use-global-hook';
import { State } from '../store';
import * as Auth from '../auth';
import { Actions } from '.';

export type LogoutActions = {
    logout: () => Promise<void>;
};

export const logout = async (store: Store<State, Actions>): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.logout()');
        await Auth.logout()
            .then(() => store.setState({ session: undefined, messages: undefined }, () => resolve()))
            .catch((err) => reject(err));
    });
};
