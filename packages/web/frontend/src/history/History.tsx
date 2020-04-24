import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import * as H from 'history';

let globalHistory: H.History<H.History.PoorMansUnknown>;

const History = (props: {} & RouteComponentProps): JSX.Element => {
    useEffect(() => {
        globalHistory = props.history;
    }, [globalHistory]);

    return <></>;
};

export const useHistory = (): H.History<H.History.PoorMansUnknown> => {
    return globalHistory;
};

export const GlobalHistory = withRouter(History);
