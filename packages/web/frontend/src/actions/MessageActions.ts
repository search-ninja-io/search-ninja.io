import { Store } from 'use-global-hook';
import { State } from '../store';
import { Actions } from '.';

export type MessageActions = {
    clearMessages: () => void;
    setError: (error: Error) => void;
    setErrors: (errors: Error[]) => void;
    setWarning: (warning: string) => void;
    setWarnings: (warings: string[]) => void;
    setSuccess: (success: string) => void;
    setSuccesses: (successes: string[]) => void;
};

export const clearMessages = (store: Store<State, Actions>): void => {
    store.setState({ messages: undefined });
};

export const setSuccess = (store: Store<State, Actions>, success: string): void => {
    store.setState({ messages: { successes: [success] } });
};

export const setSuccesses = (store: Store<State, Actions>, successes: string[]): void => {
    store.setState({ messages: { successes: successes } });
};

export const setWarning = (store: Store<State, Actions>, warning: string): void => {
    store.setState({ messages: { warnings: [warning] } });
};

export const setWarnings = (store: Store<State, Actions>, warnings: string[]): void => {
    store.setState({ messages: { warnings: warnings } });
};

export const setError = (store: Store<State, Actions>, error: Error): void => {
    store.setState({ messages: { errors: [error] } });
};

export const setErrors = (store: Store<State, Actions>, errors: Error[]): void => {
    store.setState({ messages: { errors: errors } });
};
