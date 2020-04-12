import React, { createContext, useContext, useReducer, ReducerState, Dispatch, ReactNode } from 'react';
import { Session } from '../utils/Auth';

export interface State {
    session?: Session;
}

export interface StateAction {
    type: string;
}

export interface LoginStateAction extends StateAction {
    session: Session;
}
export const LoginStateAction = (session: Session): LoginStateAction => {
    return {
        type: 'Login',
        session: session,
    };
};

export interface LogoutStateAction extends StateAction {
    session?: undefined;
}
export const LogoutStateAction = (): LogoutStateAction => {
    return {
        type: 'Logout',
    };
};

type StateReducer = (prevState: State, action: StateAction) => State;

type StateContextProps = [State, Dispatch<StateAction>];

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
export const StateContext = createContext<StateContextProps>([{}, (value: StateAction): void => {}]);

export const StateProvider = ({
    reducer,
    initialState,
    children,
}: {
    reducer: StateReducer;
    initialState: ReducerState<StateReducer>;
    children: ReactNode;
}): JSX.Element => (
    <StateContext.Provider value={useReducer<StateReducer>(reducer, initialState)}>{children}</StateContext.Provider>
);

export const useStateValue = (): StateContextProps => useContext(StateContext);
