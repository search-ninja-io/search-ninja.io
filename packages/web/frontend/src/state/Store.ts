import React from 'react';
import useGlobalHook, { Store } from 'use-global-hook';
import * as actions from '../actions';
import { Hub } from 'aws-amplify';

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
    initialized: true,
    isAuthenticated: false,
    currentUserDetails: undefined,
    message: {
        success: [],
        warning: [],
        error: [],
    },
};

const registerHub = (store: Store<State, actions.Actions>): void => {
    Hub.listen('auth', (data) => {
        switch (data.payload.event) {
            case 'signIn':
                console.log('Hub.listen(signIn)');
                store.actions.updateUserSession();
                break;

            case 'signIn_failure':
                console.log('Hub.listen(signIn_failure)');
                store.actions.updateUserSession();
                store.actions.setError(data.payload.data);
                break;

            default:
                break;
        }
    });
};

export const useGlobalStore = useGlobalHook<State, actions.Actions>(
    React,
    initialState,
    actions,
    async (store: Store<State, actions.Actions>) => {
        console.log('SessionStore.Initializer');
        registerHub(store);
        await store.actions.updateUserSession();
    },
);
