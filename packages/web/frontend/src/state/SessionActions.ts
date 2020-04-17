import { Store } from 'use-global-hook';
import { SessionState } from './SessionStore';
import * as Auth from '../auth/Auth';
import { getSession } from '../auth/Auth';

export type SessionActions = {
    login: (
        username: string,
        password: string,
        rememberDevice: boolean,
    ) => Promise<Auth.LoginResultTotpRequired | undefined>;

    isUserLoggedIn: () => boolean;
    verifyToken: (mfaCode: string, data: Auth.LoginResultTotpRequired) => Promise<void>;
    logout: () => Promise<void>;
    recoverSession: () => Promise<boolean>;
    changePassword: (password: string, newPassword: string) => Promise<boolean>;
    forgotPasswordCodeRequest: (email: string) => Promise<void>;
    forgotPasswordConfirm: (email: string, code: string, newPassword: string) => Promise<void>;
    signup: (email: string, name: string, password: string) => Promise<void>;
};

export const isUserLoggedIn = (store: Store<SessionState, SessionActions>): boolean => {
    const { session } = store.state;
    if (!session || !session.cognitoSession.isValid()) {
        return false;
    }
    return true;
};

// TODO: Pass Cognito User and Remember Device via Global Store (Temp Credentials) => check first if this is no security risk
export const login = async (
    store: Store<SessionState, SessionActions>,
    username: string,
    password: string,
    rememberDevice: boolean,
): Promise<Auth.LoginResultTotpRequired | undefined> => {
    return new Promise<Auth.LoginResultTotpRequired | undefined>((resolve, reject) => {
        console.log('SessionActions.login()', username, rememberDevice);
        Auth.login(username, password, rememberDevice)
            .then((loginResult) => {
                if (loginResult.type === 'LoginResultTotpRequired') {
                    const result = loginResult as Auth.LoginResultTotpRequired;
                    console.log('SessionActions.login() - TOTP Required');
                    resolve(result);
                } else {
                    const { session } = loginResult as Auth.LoginResult;
                    console.log('SessionActions.login() - Success');
                    store.setState({ session: session }, () => resolve());
                }
            })
            .catch((err) => {
                console.error('SessionActions.login() - Error', err);
                reject(err);
            });
    });
};

export const verifyToken = async (
    store: Store<SessionState, SessionActions>,
    mfaCode: string,
    data: Auth.LoginResultTotpRequired,
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        console.log('SessionActions.verifyToken()');
        Auth.sendSoftwareToken(data.user, mfaCode, data.rememberDevice)
            .then((mfaResult) => {
                const { session } = mfaResult;
                console.log('SessionActions.verifyToken() - Success');
                store.setState({ session: session }, () => resolve());
            })
            .catch((err) => {
                console.error('SessionActions.verifyToken() - Error', err);
                reject(err);
            });
    });
};

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

export const recoverSession = async (store: Store<SessionState, SessionActions>): Promise<boolean> => {
    return new Promise<boolean>(async (resolve) => {
        console.log('SessionActions.recoverSession()');
        await getSession()
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

export const changePassword = async (
    store: Store<SessionState, SessionActions>,
    password: string,
    newPassword: string,
): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        console.log('SessionActions.changePassword()');
        const { session } = store.state;
        if (!session) {
            console.error('SessionActions.changePassword() - Error -> No user is logged in to change password');
            reject('No user is logged in to change password.');
            return;
        }
        await Auth.changePassword(session, password, newPassword)
            .then(() => console.log('SessionActions.changePassword() - Success'))
            .then(() => logout(store))
            .then(() => resolve())
            .catch((err) => {
                console.error('SessionActions.changePassword() - Error', err);
                reject(err);
            });
    });
};

export const forgotPasswordCodeRequest = async (
    store: Store<SessionState, SessionActions>,
    email: string,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('SessionActions.forgotPasswordCodeRequest()', email);
        await Auth.forgotPasswordCodeRequest(email)
            .then(() => console.log('SessionActions.forgotPasswordCodeRequest() - Success'))
            .then(() => resolve())
            .catch((err) => {
                console.error('SessionActions.forgotPasswordCodeRequest() - Error', err);
                reject(err);
            });
    });
};

export const forgotPasswordConfirm = async (
    store: Store<SessionState, SessionActions>,
    email: string,
    code: string,
    newPassword: string,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('SessionActions.forgotPasswordConfirm()', email);
        await Auth.forgotPasswordConfirm(email, code, newPassword)
            .then(() => console.log('SessionActions.forgotPasswordConfirm() - Success'))
            .then(() => logout(store))
            .then(() => resolve())
            .catch((err) => {
                console.error('SessionActions.forgotPasswordConfirm() - Error', err);
                reject(err);
            });
    });
};

export const signup = async (
    store: Store<SessionState, SessionActions>,
    email: string,
    name: string,
    password: string,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('SessionActions.signup()', email, name);
        await Auth.signup(email, name, password)
            .then(() => console.log('SessionActions.signup() - Success'))
            .then(() => logout(store))
            .then(() => resolve())
            .catch((err) => {
                console.error('SessionActions.signup() - Error', err);
                reject(err);
            });
    });
};
