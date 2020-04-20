import { hot } from 'react-hot-loader/root';

import React from 'react';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

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

const App: React.FC = () => {
    const [{ initialized }] = useSessionStore();

    if (!initialized) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <Router>
                    <NavigationBar />
                    <MessageBanner />
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/home" />
                        </Route>
                        <Route path="/home" component={Home} />
                        <Route path="/signup" component={SignUp} />
                        <Route path="/login" component={Login} />
                        <Route path="/logout" component={Logout} />
                        <Route path="/forgotpassword" component={ForgotPassword} />
                        <Route path="/settings" component={Settings} />
                        <Route path="/search" component={Search} />
                        <Route component={NotFound} />
                    </Switch>
                </Router>
            </div>
        );
    }
};

export default hot(App);
