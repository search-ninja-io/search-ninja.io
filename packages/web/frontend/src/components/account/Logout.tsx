import React, { useEffect, useState } from 'react';
import { useStateValue, LogoutStateAction } from '../State';
import { logout } from '../../utils/Auth';
import { Redirect } from 'react-router-dom';

import { MessageBanner } from "../banner/MessageBanner";

export const Logout = () => {

    const [error, setError] = useState<Error>();

    const [{ session }, dispatch] = useStateValue();

    useEffect(() => {
        logout()
            .then(() => dispatch(LogoutStateAction()))
            .catch(err => setError);
    }, [session, dispatch]);

    if (!session) {
        return (
            <Redirect to="/home" />
        );
    }

    return (
        <>
            {error ? <MessageBanner errors={[error]} /> : <></>}
            <h1>Logout in progress</h1>
        </>
    );

};

export default Logout;