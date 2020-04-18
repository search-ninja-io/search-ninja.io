import { Store } from 'use-global-hook';
import { SessionState } from '../SessionStore';
import * as Auth from '../../auth/Auth';
import { SessionActions } from '../SessionActions';

export const logout = async (store: Store<SessionState, SessionActions>): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        console.log('SessionActions.logout()');
        Auth.logout()
            .then(() => store.setState({ session: undefined, messages: undefined }, () => resolve()))
            .catch((err) => reject(err));
    });
};
