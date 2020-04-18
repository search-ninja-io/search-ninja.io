import React from 'react';
import useGlobalHook from 'use-global-hook';
import * as actions from './SessionActions';
import { Session } from '../auth/Auth';
import { CognitoUser } from 'amazon-cognito-identity-js';

export type SessionState = {
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

const initialState: SessionState = {
    messages: {
        successes: [],
        warnings: [],
        errors: [],
    },
    session: undefined,
    totpSession: undefined,
};

export const useSessionStore = useGlobalHook<SessionState, actions.SessionActions>(React, initialState, actions);
