import React from 'react';
import { Alert } from 'react-bootstrap';
import { useSessionStore } from '../../state/SessionStore';

export const MessageBanner = (): JSX.Element => {
    const [sessionState] = useSessionStore();

    const successes = sessionState.messages?.successes ? sessionState.messages.successes : [];
    const warnings = sessionState.messages?.warnings ? sessionState.messages.warnings : [];
    const errors = sessionState.messages?.errors ? sessionState.messages.errors : [];

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
