import React from 'react';

type ErrorProps = { message: string };

export const Error = (props: ErrorProps): JSX.Element => {
    return (
        <div>
            <p>Error: {props.message}</p>
        </div>
    );
};

export default Error;
