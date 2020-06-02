import React from 'react';
import { useEffect, useState } from 'react';
import { Config, load } from '../config';

type LoadingState = {
    isLoaded: boolean;
    config?: Config;
};

type ConfigLoaderProps = {
    ready: (config: Config) => JSX.Element;
};

export const ConfigLoader = (props: ConfigLoaderProps): JSX.Element => {
    const [state, setState] = useState<LoadingState>({ isLoaded: false });

    useEffect(() => {
        load().then((config) => setState({ isLoaded: true, config }));
    }, []);

    if (!state.isLoaded) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!state.config) {
        return (
            <div>
                <p>Initialization failed</p>
            </div>
        );
    }
    return props.ready(state.config);
};
