import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';

import { configMap, NavType, NavDocument, NavApi } from '../config';
import { PageNotFound } from './PageNotFound';
import { Doc } from './Doc';
import { Api } from './Api';
import { Error } from './Error';

type PageProps = RouteComponentProps<{ path: string }, StaticContext>;

export const Page = (props: PageProps): JSX.Element => {
    const key = props.location.pathname;
    const [component, setComponent] = useState<JSX.Element>();

    useEffect(() => {
        const nav = configMap.get(key);
        if (!nav) {
            setComponent(<PageNotFound />);
        } else if (nav.Type === NavType.DOC) {
            setComponent(<Doc nav={nav as NavDocument} />);
        } else if (nav.Type === NavType.API) {
            setComponent(<Api nav={nav as NavApi} />);
        } else {
            setComponent(<Error message={"Config Error - NavType '" + nav.Type + "' is not handled."} />);
        }
    }, [key]);

    if (!component) {
        return <p>Loading...</p>;
    }

    return component;
};

export default Page;
