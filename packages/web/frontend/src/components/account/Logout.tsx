import React, { useEffect } from 'react';
import { useSessionStore } from '../../state/SessionStore';
import { RouteComponentProps } from 'react-router-dom';

export const Logout = (props: RouteComponentProps): JSX.Element => {
    const [, sessionActions] = useSessionStore();

    useEffect(() => {
        if (sessionActions.isUserLoggedIn()) {
            sessionActions
                .logout()
                .then(() => props.history.push('/home'))
                .catch((err) => sessionActions.setError(err));
        }
    }, [sessionActions.isUserLoggedIn()]);

    return (
        <>
            <h1>Logout in progress</h1>
        </>
    );
};

export default Logout;
