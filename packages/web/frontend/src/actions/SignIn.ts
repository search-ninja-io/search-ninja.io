import { Store } from 'use-global-hook';
import { State } from '../state';
import { Actions } from '.';

import { Auth } from 'aws-amplify';
import { useHistory } from '../history';

export type SignInActions = {
    signIn: (
        username: string,
        password: string,
        rememberDevice: boolean,
        referrer: { pathname: string; search: string; hash: string },
    ) => Promise<SignInResponse>;
    confirmSignIn: (
        user: unknown,
        verificationCode: string,
        referrer: { pathname: string; search: string; hash: string },
    ) => Promise<void>;
};

const updateLoginState = async (
    store: Store<State, Actions>,
    referrer: { pathname: string; search: string; hash: string },
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const currentCognitoUser = await Auth.currentAuthenticatedUser({ bypassCache: false });
            if (!currentCognitoUser) throw new Error('No user is logged in to change password.');

            const { attributes } = currentCognitoUser;
            const email = attributes['email'];
            const name = attributes['name'];

            const isTotpEnabled = await store.actions.isTotpEnabled();

            store.setState(
                {
                    isAuthenticated: true,
                    currentUserDetails: {
                        email: email,
                        name: name,
                        isTotpEnabled: isTotpEnabled,
                    },
                    message: undefined,
                },
                () => {
                    useHistory().push(referrer);
                    resolve();
                },
            );
        } catch (err) {
            reject(err);
        }
    });
};

export enum SignInResponseType {
    TOTP = 1,
    SUCCESS = 2,
}

export interface SignInResponse {
    response: SignInResponseType;
    user?: unknown;
    device?: string;
}

export const signIn = async (
    store: Store<State, Actions>,
    username: string,
    password: string,
    rememberDevice: boolean,
    referrer: { pathname: string; search: string; hash: string },
): Promise<SignInResponse> => {
    return new Promise<SignInResponse>(async (resolve, reject) => {
        console.log('Actions.signIn()', username, rememberDevice, referrer);
        try {
            const cognitoUser = await Auth.signIn(username, password);
            const { challengeName, challengeParam } = cognitoUser;

            switch (challengeName) {
                case 'SMS_MFA':
                case 'NEW_PASSWORD_REQUIRED':
                case 'MFA_SETUP':
                    reject(challengeName + ': not yet implemented');
                    break;

                case 'SOFTWARE_TOKEN_MFA':
                    store.actions.clearMessages();
                    resolve({
                        response: SignInResponseType.TOTP,
                        user: cognitoUser,
                        device: challengeParam.FRIENDLY_DEVICE_NAME,
                    });
                    break;

                default:
                    await updateLoginState(store, referrer);
                    resolve({ response: SignInResponseType.SUCCESS });
                    break;
            }
        } catch (err) {
            reject(err);
        }
    });
};

export const confirmSignIn = async (
    store: Store<State, Actions>,
    user: unknown,
    verificationCode: string,
    referrer: { pathname: string; search: string; hash: string },
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.confirmSignIn()');
        try {
            await Auth.confirmSignIn(user, verificationCode, 'SOFTWARE_TOKEN_MFA');
            await updateLoginState(store, referrer);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
};
