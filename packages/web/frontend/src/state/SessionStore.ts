import React from 'react';
import useGlobalHook from 'use-global-hook';
import * as actions from './sessionactions/SessionActions';
import { Session } from '../auth/Auth';
import { CognitoUser } from 'amazon-cognito-identity-js';

export type SessionState = {
    session?: Session;
    totpSession?: {
        user: CognitoUser;
        device: string;
        rememberDevice: boolean;
    };
};

const initialState: SessionState = {
    session: undefined,
    totpSession: undefined,
};

export const useSessionStore = useGlobalHook<SessionState, actions.SessionActions>(React, initialState, actions);
