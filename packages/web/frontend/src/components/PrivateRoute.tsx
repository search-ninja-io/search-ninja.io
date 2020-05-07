import React, { useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useAuth0 } from '../auth/Auth0Context';

export const PrivateRoute: React.FC<RouteProps> = (props: RouteProps) => {
    const { isInitializing, isAuthenticated, loginWithRedirect } = useAuth0();

    const path = props.path;

    useEffect(() => {
        if (isInitializing || isAuthenticated) {
            return;
        }
        const fn = async (): Promise<void> => {
            await loginWithRedirect({
                appState: { targetUrl: window.location.pathname },
            });
        };
        fn();
    }, [isInitializing, isAuthenticated, loginWithRedirect, path]);

    if (isAuthenticated) {
        return <Route {...props} />;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { component, ...rest } = props;

    return <Route {...rest} render={(): React.ReactNode => null} />;
};

export default PrivateRoute;
