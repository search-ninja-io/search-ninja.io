import React, { createContext, useContext, useReducer, ReducerState, Dispatch } from 'react';
import { Session } from '../utils/Auth';

export interface State {
    session?: Session;
};

export interface StateAction {
    type: string;
};

export interface LoginStateAction extends StateAction {
    session: Session;
}
export const LoginStateAction = (session: Session): LoginStateAction => {
    return {
        type: "Login",
        session: session
    };
};

export interface LogoutStateAction extends StateAction {
    session?: undefined;
}
export const LogoutStateAction = (): LogoutStateAction => {
    return {
        type: "Logout"
    };
};


type StateReducer = (prevState: State, action: StateAction) => State;

type StateContextProps = [State, Dispatch<StateAction>];

export const StateContext = createContext<StateContextProps>([
    {},
    (value: StateAction) => { }
]);

export const StateProvider = ({ reducer, initialState, children }: { reducer: StateReducer, initialState: ReducerState<StateReducer>, children: any; }) => (
    <StateContext.Provider value={useReducer<StateReducer>(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);
