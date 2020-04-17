import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import styled from 'styled-components';

import { useSessionStore } from '../../state/SessionStore';

import { NavigationBarLarge } from './NavigationBarLarge';
import { NavigationBarSmall } from './NavigationBarSmall';

const Styled = styled.div`
    #table-user {
        width: 500px;
        max-width: 500px;
    }
    #row-header {
        background-color: lightgray;
        color: white;
        height: 40px;
    }
    #avatar {
        width: 80px;
        height: 80px;
    }
    #userlabel {
        color: white;
    }
    #emaillabel {
        color: white;
    }

    .setting-button {
        display: block;
        width: 100%;
        padding: 0 0 0 0;
        clear: both;
        font-weight: 400;
        color: #007bff;
        text-align: inherit;
        white-space: nowrap;
        background-color: transparent;
        border: 0;
    }

    .setting-button:hover {
        color: #0056b3;
    }
`;

export const NavigationBar = withRouter((props: RouteComponentProps) => {
    const [{ session }, sessionActions] = useSessionStore();

    useEffect(() => {
        if (!session) {
            sessionActions.recoverSession().catch((err) => console.error('Session Recovery Error', err));
        }
    }, [session, sessionActions]);

    return (
        <Styled>
            <NavigationBarLarge session={session} routeCompProps={props} />
            <NavigationBarSmall session={session} routeCompProps={props} />
        </Styled>
    );
});

export default NavigationBar;
