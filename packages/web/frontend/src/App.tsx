import { hot } from 'react-hot-loader/root';

import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { NavBar } from './components/NavBar';
import { Settings } from './components/Settings';
import { Home } from './components/Home';
import { Search } from './components/Search';
import { MessageBar } from './components/MessageBar';
import { NotFound } from './components/NotFound';

import { PrivateRoute } from './components/PrivateRoute';
import history from './utils/history';

const App: React.FC = () => {
    return (
        <Router history={history}>
            <NavBar />
            <MessageBar />
            <Switch>
                <Route exact path="/" component={Home} />
                <PrivateRoute path={['/settings/:tab', '/settings']} component={Settings} />
                <PrivateRoute path="/search" component={Search} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
};

export default hot(App);
