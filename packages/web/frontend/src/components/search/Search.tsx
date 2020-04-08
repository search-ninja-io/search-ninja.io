import React from 'react';
import { useStateValue } from '../State';
import { Redirect } from 'react-router-dom';

export const Search = () => {

    const [{ session }] = useStateValue();
    if (!session) {
        return (<Redirect to="/login" />);
    }

    return (<h1>Search</h1>);
};