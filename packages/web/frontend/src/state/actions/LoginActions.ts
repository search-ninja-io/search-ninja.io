import { Store } from 'use-global-hook';
import { SessionState } from '../SessionStore';
import * as Auth from '../../auth/Auth';
import { SessionActions } from '../SessionActions';

export const isUserLoggedIn = (store: Store<SessionState, SessionActions>): boolean => {
    const { session } = store.state;
    if (!session || !session.cognitoSession.isValid()) {
        return false;
    }
    return true;
};

export const login = async (
    store: Store<SessionState, SessionActions>,
    username: string,
    password: string,
    rememberDevice: boolean,
): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        console.log('SessionActions.login()', username, rememberDevice);
        Auth.login(username, password, rememberDevice)
            .then((loginResult) => {
                if (loginResult.type === 'LoginResultTotpRequired') {
                    const { user, device, rememberDevice } = loginResult as Auth.LoginResultTotpRequired;
                    const state = {
                        messages: undefined,
                        totpSession: { user: user, device: device, rememberDevice: rememberDevice },
                    };
                    store.setState(state);
                    resolve(true);
                } else {
                    const { session } = loginResult as Auth.LoginResult;
                    store.setState({ messages: undefined, session: session }, () => resolve(false));
                }
            })
            .catch((err) => reject(err));
    });
};

export const recoverSession = async (store: Store<SessionState, SessionActions>): Promise<boolean> => {
    return new Promise<boolean>(async (resolve) => {
        console.log('SessionActions.recoverSession()');
        await Auth.getSession()
            .then((session) => {
                console.log('SessionActions.recoverSession() - Session found');
                if (!store.state.session && session) {
                    console.log('SessionActions.recoverSession() - Update Session State');
                    store.setState({ session: session });
                }
                resolve(true);
            })
            .catch(() => {
                console.log('SessionActions.recoverSession() - Session not found');
                resolve(false);
            });
    });
};
