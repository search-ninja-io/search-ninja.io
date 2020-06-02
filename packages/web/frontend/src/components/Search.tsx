import React, { useEffect, useState } from 'react';
import { useAuth0 } from '../auth/Auth0Context';
import { useGlobalStore } from '../utils/store';

export const Search: React.FC = () => {
    const [pets, setPets] = useState();
    const { isAuthenticated, getTokenSilently } = useAuth0();
    const [, actions] = useGlobalStore();

    useEffect(() => {
        if (!pets && isAuthenticated) {
            getTokenSilently()
                .then((accessToken) => {
                    return fetch('https://api-dev.search-ninja.io/auth-v1/user/change-password', {
                        method: 'GET',
                        mode: 'cors',
                        credentials: 'include',
                        headers: {
                            Authorization: 'Bearer ' + accessToken,
                        },
                    });
                })
                .then((result) => result.json())
                .then((data) => setPets(data))
                .catch((err) => actions.setError(err));
        }
    }, [pets, isAuthenticated]);

    return (
        <>
            <h1>Search</h1>
            <div>
                <pre>{pets ? JSON.stringify(pets, null, 2) : 'Loading...'}</pre>
            </div>
        </>
    );
};
