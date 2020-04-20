import React from 'react';
import useGlobalHook, { Store } from 'use-global-hook';
import * as actions from '../actions';
import { Session, getSession } from '../auth/Auth';
import { CognitoUser } from 'amazon-cognito-identity-js';

export type State = {
    initialized?: boolean;
    messages?: {
        successes?: string[];
        warnings?: string[];
        errors?: Error[];
    };
    session?: Session;
    totpSession?: {
        user: CognitoUser;
        device: string;
        rememberDevice: boolean;
    };
};

const initialState: State = {
    initialized: false,
    messages: {
        successes: [],
        warnings: [],
        errors: [],
    },
    session: undefined,
    totpSession: undefined,
};

export const useGlobalStore = useGlobalHook<State, actions.Actions>(
    React,
    initialState,
    actions,
    async (store: Store<State, actions.Actions>) => {
        console.log('SessionStore.Initializer');
        const session = await getSession()
            .then((session) => session)
            .catch(() => undefined);
        store.setState({ initialized: true, session: session });
    },
);
