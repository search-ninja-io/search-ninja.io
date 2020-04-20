import { hot } from 'react-hot-loader/root';

import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { NavigationBar } from './components/navigationbar/NavigationBar';

import { Login } from './components/account/Login';
import { Logout } from './components/account/Logout';
import { ForgotPassword } from './components/account/ForgotPassword';
import { SignUp } from './components/account/SignUp';
import { Settings } from './components/account/Settings';

import { Home } from './components/home/Home';
import { Search } from './components/search/Search';

import { NotFound } from './components/NotFound';
import MessageBanner from './components/banner/MessageBanner';
import { useSessionStore } from './state/SessionStore';
import ProtectedRoute, { ProtectedRouteProps } from './components/ProtectedRoute';

const App: React.FC = () => {
    const [{ initialized }, sessionActions] = useSessionStore();

    const defaultProps: ProtectedRouteProps = {
        isAuthenticated: sessionActions.isUserLoggedIn,
        authenticationPath: '/login',
    };

    if (!initialized) {
        return <div>Loading...</div>;
    } else {
        return (
            <Router>
                <NavigationBar />
                <MessageBanner />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/signup" component={SignUp} />
                    <Route path="/login" component={Login} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/forgotpassword" component={ForgotPassword} />
                    <ProtectedRoute {...defaultProps} path={['/settings/:tab', '/settings']} component={Settings} />
                    <ProtectedRoute {...defaultProps} path="/search" component={Search} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }
};

export default hot(App);
