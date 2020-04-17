import React from 'react';
import { useSessionStore } from '../../state/SessionStore';
import { Redirect } from 'react-router-dom';

export const Search = (): JSX.Element => {
    const [, sessionActions] = useSessionStore();

    if (!sessionActions.isUserLoggedIn()) {
        return <Redirect to="/login" />;
    }

    return <h1>Search</h1>;
};
