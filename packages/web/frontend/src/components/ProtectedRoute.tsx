import React from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router';

export interface ProtectedRouteProps extends RouteProps {
    isAuthenticated: () => boolean;
    authenticationPath: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = (props: ProtectedRouteProps) => {
    if (props.isAuthenticated()) {
        return <Route {...props} />;
    }

    const referrer = useLocation();
    const redirectPath = props.authenticationPath;
    const renderComponent = (): JSX.Element => (
        <Redirect to={{ pathname: redirectPath, state: { referrer: referrer } }} />
    );
    return <Route {...props} component={renderComponent} render={undefined} />;
};

export default ProtectedRoute;
