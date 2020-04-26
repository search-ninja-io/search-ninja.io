import React, { useEffect } from 'react';
import { useGlobalStore } from '../../state';

export const SignOut = (): JSX.Element => {
    const [{ isAuthenticated, currentUserDetails }, actions] = useGlobalStore();

    useEffect(() => {
        if (isAuthenticated || currentUserDetails) {
            actions.signOut().catch((err) => actions.setError(err));
        }
    }, [isAuthenticated]);

    return (
        <>
            <h1>Signout in progress</h1>
        </>
    );
};

export default SignOut;
