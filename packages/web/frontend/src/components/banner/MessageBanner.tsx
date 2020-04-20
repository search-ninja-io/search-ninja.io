import React from 'react';
import { Alert } from 'react-bootstrap';
import { useGlobalStore } from '../../store';

export const MessageBanner = (): JSX.Element => {
    const [state] = useGlobalStore();

    const successes = state.messages?.successes ? state.messages.successes : [];
    const warnings = state.messages?.warnings ? state.messages.warnings : [];
    const errors = state.messages?.errors ? state.messages.errors : [];

    return (
        <>
            {errors.length > 0 ? (
                <Alert className="m-3" key="error" variant="danger">
                    {errors.map((value, index) => {
                        return <div key={'error-' + index}>{value.message}</div>;
                    })}
                </Alert>
            ) : (
                <></>
            )}

            {warnings.length > 0 ? (
                <Alert className="m-3" key="warning" variant="warning">
                    {warnings.map((value, index) => {
                        return <div key={'warning-' + index}>{value}</div>;
                    })}
                </Alert>
            ) : (
                <></>
            )}

            {successes.length > 0 ? (
                <Alert className="m-3" key="success" variant="success">
                    {successes.map((value, index) => {
                        return <div key={'success-' + index}>{value}</div>;
                    })}
                </Alert>
            ) : (
                <></>
            )}
        </>
    );
};

export default MessageBanner;
