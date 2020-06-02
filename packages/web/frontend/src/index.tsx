import { config } from './config/config';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Auth0Provider } from './auth/Auth0Context';
import { RedirectLoginResult } from '@auth0/auth0-spa-js';

import history from './utils/history';

import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//const onRedirectCallback = (appState?: { targetUrl: string }): void => {
const onRedirectCallback = (result: RedirectLoginResult): void => {
    history.push(result?.appState?.targetUrl ? result.appState.targetUrl : window.location.pathname);
};
ReactDOM.render(
    <React.StrictMode>
        <Auth0Provider
            domain={config.Auth0.Domain}
            client_id={config.Auth0.ClientId}
            responseType={config.Auth0.ResponseType}
            audience={config.Auth0.Audience}
            redirect_uri={window.location.origin}
            onRedirectCallback={onRedirectCallback}
            scope={config.Auth0.Scope}
            cacheLocation={config.Auth0.CacheLocation}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);

serviceWorker.unregister();
