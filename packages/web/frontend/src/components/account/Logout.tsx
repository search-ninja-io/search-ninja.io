import React, { useEffect } from 'react';
import { useGlobalStore } from '../../store';
import { RouteComponentProps } from 'react-router-dom';

export const Logout = (props: RouteComponentProps): JSX.Element => {
    const [, actions] = useGlobalStore();

    useEffect(() => {
        if (actions.isUserLoggedIn()) {
            actions
                .logout()
                .then(() => props.history.push('/'))
                .catch((err) => actions.setError(err));
        }
    }, [actions.isUserLoggedIn()]);

    return (
        <>
            <h1>Logout in progress</h1>
        </>
    );
};

export default Logout;
