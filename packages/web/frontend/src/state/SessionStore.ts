import React from 'react';
import useGlobalHook from 'use-global-hook';
import * as actions from './SessionActions';
import { Session } from '../auth/Auth';

export type SessionState = {
    session?: Session;
};

const initialState: SessionState = {
    session: undefined,
};

export const useSessionStore = useGlobalHook<SessionState, actions.SessionActions>(React, initialState, actions);
