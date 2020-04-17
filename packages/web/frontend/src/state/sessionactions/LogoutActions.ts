import { Store } from 'use-global-hook';
import { SessionState } from '../SessionStore';
import * as Auth from '../../auth/Auth';
import { SessionActions } from './SessionActions';

export const logout = async (store: Store<SessionState, SessionActions>): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        console.log('SessionActions.logout()');
        Auth.logout()
            .then(() => console.log('SessionActions.logout() - Success'))
            .then(() => store.setState({ session: undefined }, () => resolve()))
            .catch((err) => {
                console.error('SessionActions.logout() - Error', err);
                reject(err);
            });
    });
};
