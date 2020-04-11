import React from "react";

import "./App.css";

import { StateProvider, State, StateAction, LoginStateAction } from './components/State';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import { NavigationBar } from './components/navigationbar/NavigationBar';

import { Login } from './components/account/Login';
import { Logout } from './components/account/Logout';
import { ForgotPassword } from './components/account/ForgotPassword';
import { SignUp } from './components/account/SignUp';
import { Settings } from './components/account/Settings';

import { Home } from './components/home/Home';
import { Search } from './components/search/Search';

import { NotFound } from './components/NotFound';

const App = () => {

    const reducer = (prevState: State, action: StateAction) => {
        console.log("App.reducer", action);
        switch (action.type) {
            case 'Login':
                return {
                    ...prevState,
                    session: (action as LoginStateAction).session
                };

            case 'Logout':
                return {
                    ...prevState,
                    session: undefined
                };

            default:
                return prevState;
        }
    };

    const initialState = {
        session: undefined
    };

    return (
        <StateProvider initialState={initialState} reducer={reducer}>
            <Router>
                <NavigationBar />
                <Switch>
                    <Route exact path="/"><Redirect to="/home" /></Route>
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/signup" component={SignUp} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/logout" component={Logout} />
                    <Route exact path="/forgotpassword" component={ForgotPassword} />
                    <Route exact path="/settings" component={Settings} />
                    <Route exact path="/search" component={Search} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        </StateProvider >
    );

};

export default App;