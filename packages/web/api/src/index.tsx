import 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Router } from 'react-router-dom';
import { history } from './utils/history';

ReactDOM.render(
    <Router history={history}>
        <App />
    </Router>,
    document.getElementById('root'),
);

serviceWorker.unregister();
