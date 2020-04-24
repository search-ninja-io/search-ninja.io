import { hot } from 'react-hot-loader/root';

import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { NavigationBar } from './components/navigationbar/NavigationBar';
import { SignIn } from './components/account/SignIn';
import { SignOut } from './components/account/SignOut';
import { ForgotPassword } from './components/account/ForgotPassword';
import { SignUp } from './components/account/SignUp';
import { Settings } from './components/account/Settings';
import { Home } from './components/home/Home';
import { Search } from './components/search/Search';
import { MessageBanner } from './components/banner/MessageBanner';
import { NotFound } from './components/NotFound';

import { useGlobalStore } from './state';

import { ProtectedRoute, ProtectedRouteProps } from './components/ProtectedRoute';
import { GlobalHistory } from './history';

const App: React.FC = () => {
    const [{ initialized, isAuthenticated }] = useGlobalStore();

    const defaultProps: ProtectedRouteProps = {
        isAuthenticated: isAuthenticated || false,
        authenticationPath: '/login',
    };

    if (!initialized) {
        return <div>Loading...</div>;
    } else {
        return (
            <Router>
                <GlobalHistory />
                <NavigationBar />
                <MessageBanner />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/signup" component={SignUp} />
                    <Route path="/login" component={SignIn} />
                    <Route path="/logout" component={SignOut} />
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
