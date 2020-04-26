import { Store } from 'use-global-hook';
import { State } from '../state';
import { Actions } from '.';

import { Auth } from 'aws-amplify';
import { useHistory } from '../history';

import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';

export type SignInActions = {
    signIn: (
        username: string,
        password: string,
        referrer: { pathname: string; search: string; hash: string },
    ) => Promise<SignInResponse>;
    confirmSignIn: (
        user: unknown,
        verificationCode: string,
        referrer: { pathname: string; search: string; hash: string },
    ) => Promise<void>;
    updateUserSession: (referrer?: { pathname: string; search: string; hash: string }) => Promise<void>;
    federatedAmazonSignIn: () => Promise<void>;
    federatedCognitoSignIn: () => Promise<void>;
    federatedFacebookSignIn: () => Promise<void>;
    federatedGoogleSignIn: () => Promise<void>;
};

export const updateUserSession = async (
    store: Store<State, Actions>,
    referrer?: { pathname: string; search: string; hash: string },
): Promise<void> => {
    return new Promise<void>(async (resolve) => {
        let cognitoUser;
        try {
            console.log('Actions.updateUserSession() - Get current authenticated user');
            cognitoUser = await Auth.currentAuthenticatedUser({ bypassCache: false });
        } catch (err) {
            console.log('Actions.updateUserSession() - No user authenticated');
            store.setState(
                {
                    initialized: true,
                    isAuthenticated: false,
                    currentUserDetails: undefined,
                    message: undefined,
                },
                () => {
                    resolve();
                },
            );
            return;
        }

        console.log('Actions.updateUserSession() - Authenticated user:', cognitoUser);
        const { attributes } = cognitoUser;
        const email = attributes['email'];
        const name = attributes['name'];
        const totpEnabled = await store.actions.isTotpEnabled();
        console.log('actions.updateUserSession() - Update global user session');
        store.setState(
            {
                initialized: true,
                isAuthenticated: true,
                currentUserDetails: { email: email, name: name, isTotpEnabled: totpEnabled },
                message: undefined,
            },
            () => {
                const history = useHistory();
                if (history) {
                    history.push(referrer ? referrer : { pathname: '/', search: '', hash: '' });
                }
                resolve();
            },
        );
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
    referrer: { pathname: string; search: string; hash: string },
): Promise<SignInResponse> => {
    return new Promise<SignInResponse>(async (resolve, reject) => {
        console.log('Actions.signIn()', username, referrer);
        try {
            const cognitoUser = await Auth.signIn(username, password);
            const { challengeName, challengeParam } = cognitoUser;

            console.log('Actions.signIn(' + challengeName + ')', cognitoUser);
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
                    await updateUserSession(store, referrer);
                    resolve({ response: SignInResponseType.SUCCESS });
                    break;
            }
        } catch (err) {
            reject(err);
        }
    });
};

// TODO: Redirect to referrer in case of federated sign in (if possible)
const federatedSignIn = async (
    store: Store<State, Actions>,
    provider: CognitoHostedUIIdentityProvider,
): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Actions.federatedSignIn(' + provider + ')');
        try {
            await Auth.federatedSignIn({ provider: provider });
            resolve();
        } catch (err) {
            reject(err);
        }
    });
};

export const federatedGoogleSignIn = async (store: Store<State, Actions>): Promise<void> =>
    federatedSignIn(store, CognitoHostedUIIdentityProvider.Google);

export const federatedFacebookSignIn = async (store: Store<State, Actions>): Promise<void> =>
    federatedSignIn(store, CognitoHostedUIIdentityProvider.Facebook);

export const federatedAmazonSignIn = async (store: Store<State, Actions>): Promise<void> =>
    federatedSignIn(store, CognitoHostedUIIdentityProvider.Amazon);

export const federatedCognitoSignIn = async (store: Store<State, Actions>): Promise<void> =>
    federatedSignIn(store, CognitoHostedUIIdentityProvider.Cognito);

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
            await updateUserSession(store, referrer);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
};
