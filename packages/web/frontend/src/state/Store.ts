import React from 'react';
import useGlobalHook, { Store } from 'use-global-hook';
import * as actions from '../actions';
import { Auth } from 'aws-amplify';

export type State = {
    initialized?: boolean;
    isAuthenticated?: boolean;
    currentUserDetails?: {
        name: string;
        email: string;
        isTotpEnabled: boolean;
    };
    message?: {
        success?: string[];
        warning?: string[];
        error?: Error[];
    };
};

const initialState: State = {
    initialized: false,
    isAuthenticated: false,
    currentUserDetails: undefined,
    message: {
        success: [],
        warning: [],
        error: [],
    },
};

export const useGlobalStore = useGlobalHook<State, actions.Actions>(
    React,
    initialState,
    actions,
    async (store: Store<State, actions.Actions>) => {
        console.log('SessionStore.Initializer');
        let cognitoUser;
        try {
            cognitoUser = await Auth.currentAuthenticatedUser({ bypassCache: false });
        } catch (err) {
            console.log('SessionStore.recover() - No user authenticated');
            store.setState({ initialized: true, isAuthenticated: false, currentUserDetails: undefined });
            return;
        }

        console.log('SessionStore.recover() - User authenticated and session recovered');
        const { attributes } = cognitoUser;
        const email = attributes['email'];
        const name = attributes['name'];
        const totpEnabled = await store.actions.isTotpEnabled();
        store.setState({
            initialized: true,
            isAuthenticated: true,
            currentUserDetails: { email: email, name: name, isTotpEnabled: totpEnabled },
        });
    },
);
