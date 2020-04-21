import { Store } from 'use-global-hook';
import { State } from '../store';
import * as Auth from '../auth';
import { Actions } from '.';

export type LoginActions = {
    isUserLoggedIn: () => boolean;
    recoverSession: () => Promise<boolean>;
    login: (username: string, password: string, rememberDevice: boolean) => Promise<boolean>;
};

export const isUserLoggedIn = (store: Store<State, Actions>): boolean => {
    const { session } = store.state;
    if (!session || !session.cognitoSession.isValid()) {
        return false;
    }
    return true;
};

export const login = async (
    store: Store<State, Actions>,
    username: string,
    password: string,
    rememberDevice: boolean,
): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        console.log('Actions.login()', username, rememberDevice);
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
                    store.setState(
                        {
                            messages: undefined,
                            session: session,
                        },
                        () => resolve(false),
                    );
                }
            })
            .catch((err) => reject(err));
    });
};

export const recoverSession = async (store: Store<State, Actions>): Promise<boolean> => {
    return new Promise<boolean>(async (resolve) => {
        console.log('Actions.recoverSession()');
        await Auth.getSession()
            .then((session) => {
                console.log('Actions.recoverSession() - Session found');
                if (!store.state.session && session) {
                    console.log('Actions.recoverSession() - Update Session State');
                    store.setState({ session: session });
                }
                resolve(true);
            })
            .catch(() => {
                console.log('Actions.recoverSession() - Session not found');
                resolve(false);
            });
    });
};
