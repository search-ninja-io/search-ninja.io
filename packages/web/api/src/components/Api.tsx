import React, { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SwaggerUI = require('swagger-ui');
import 'swagger-ui/dist/swagger-ui.css';

import { config, NavApi } from '../config';

export const Api = (props: { nav: NavApi }): JSX.Element => {
    const [state, setState] = useState<{
        navApi?: NavApi;
        error?: string;
    }>({});
    const { nav } = props;

    useEffect(() => {
        const swaggerUi = SwaggerUI({
            url: nav.SwaggerUrl,
            dom_id: '#swagger-ui',
        });

        swaggerUi.initOAuth({
            clientId: config.Auth0.ClientId,
            additionalQueryStringParams: {
                audience: config.Auth0.Audience,
                prompt: 'login',
            },
        });
        setState({ navApi: nav, error: undefined });
    }, [nav]);

    return (
        <div className="App">
            {state.error ? <p>{state.error}</p> : <></>}
            <div id="swagger-ui" />
        </div>
    );
};

export default Api;
