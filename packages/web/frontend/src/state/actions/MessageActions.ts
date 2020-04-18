import { Store } from 'use-global-hook';
import { SessionState } from '../SessionStore';
import { SessionActions } from '../SessionActions';

export const clearMessages = (store: Store<SessionState, SessionActions>): void => {
    store.setState({ messages: undefined });
};

export const setSuccess = (store: Store<SessionState, SessionActions>, success: string): void => {
    store.setState({ messages: { successes: [success] } });
};

export const setSuccesses = (store: Store<SessionState, SessionActions>, successes: string[]): void => {
    store.setState({ messages: { successes: successes } });
};

export const setWarning = (store: Store<SessionState, SessionActions>, warning: string): void => {
    store.setState({ messages: { warnings: [warning] } });
};

export const setWarnings = (store: Store<SessionState, SessionActions>, warnings: string[]): void => {
    store.setState({ messages: { warnings: warnings } });
};

export const setError = (store: Store<SessionState, SessionActions>, error: Error): void => {
    store.setState({ messages: { errors: [error] } });
};

export const setErrors = (store: Store<SessionState, SessionActions>, errors: Error[]): void => {
    store.setState({ messages: { errors: errors } });
};
