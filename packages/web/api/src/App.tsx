import { hot } from 'react-hot-loader/root';
import React from 'react';

import { ConfigLoader } from './components/ConfigLoader';
import { Main } from './components/Main';

const App = (): JSX.Element => {
    return <ConfigLoader ready={() => <Main />} />;
};

export default hot(App);
