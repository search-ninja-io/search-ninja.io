import { Store } from 'use-global-hook';
import { State } from '../utils/store';
import { Actions } from '.';

export type MessageActions = {
    clearMessages: () => void;
    setError: (error: Error | Error[] | string | string[]) => void;
    setWarning: (warning: string | string[]) => void;
    setSuccess: (success: string | string[]) => void;
};

export const clearMessages = (store: Store<State, Actions>): void => {
    store.setState({ message: undefined });
};

export const setSuccess = (store: Store<State, Actions>, value: string | string[]): void => {
    const valueArray = typeof value == 'string' ? [value] : value;
    store.setState({ message: { success: valueArray } });
};

export const setWarning = (store: Store<State, Actions>, value: string | string[]): void => {
    const valueArray = typeof value == 'string' ? [value] : value;
    store.setState({ message: { warning: valueArray } });
};

export const setError = (store: Store<State, Actions>, value: Error | Error[] | string | string[]): void => {
    if (value instanceof Array) {
        const errorArray: Error[] = [];
        value.forEach((e: Error | string) =>
            typeof e === 'string' ? errorArray.push(new Error(e)) : errorArray.push(e),
        );
        store.setState({ message: { error: errorArray } });
    } else if (typeof value === 'string') {
        store.setState({ message: { error: [new Error(value)] } });
    } else {
        store.setState({ message: { error: [value] } });
    }
};
