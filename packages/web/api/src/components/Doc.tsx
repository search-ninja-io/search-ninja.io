import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { NavDocument } from '../config';

export const Doc = (props: { nav: NavDocument }): JSX.Element => {
    const [state, setState] = useState<{ data?: string; error?: string }>();
    const { nav } = props;

    useEffect(() => {
        fetch(nav.Url)
            .then((result) => {
                if (result.ok) return result;
                throw new Error("Could not fetch '" + nav.Url + "'.");
            })
            .then((result) => result.text())
            .then((data) => setState({ data: data, error: undefined }))
            .catch((err) => setState({ data: undefined, error: err.toString() }));
    }, [nav]);

    if (!state) {
        return <p>Loading...</p>;
    }

    if (state.error) {
        return <p>{state.error}</p>;
    }

    return <ReactMarkdown source={state.data} />;
};

export default Doc;
