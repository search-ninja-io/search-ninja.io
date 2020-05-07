import React from 'react';
import useGlobalHook from 'use-global-hook';
import * as actions from '../actions';

export type State = {
    message?: {
        success?: string[];
        warning?: string[];
        error?: Error[];
    };
};

const initialState: State = {
    message: {
        success: [],
        warning: [],
        error: [],
    },
};

export const useGlobalStore = useGlobalHook<State, actions.Actions>(React, initialState, actions);
