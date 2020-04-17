import React, { useEffect } from 'react';
import { useSessionStore } from '../../state/SessionStore';
import { Redirect } from 'react-router-dom';

export const Logout = (): JSX.Element => {
    const [{ session }, sessionActions] = useSessionStore();

    useEffect(() => {
        sessionActions.logout().catch((err) => console.error(err));
    }, [session, sessionActions]);

    if (!sessionActions.isUserLoggedIn()) {
        return <Redirect to="/home" />;
    }

    return (
        <>
            <h1>Logout in progress</h1>
        </>
    );
};

export default Logout;
