import React from 'react';
import { Alert } from 'react-bootstrap';
import { useGlobalStore } from '../../state';

export const MessageBanner = (): JSX.Element => {
    const [state] = useGlobalStore();

    const success = state.message?.success ? state.message.success : [];
    const warning = state.message?.warning ? state.message.warning : [];
    const error = state.message?.error ? state.message.error : [];

    return (
        <>
            {error.length > 0 ? (
                <Alert className="m-3" key="error" variant="danger">
                    {error.map((value, index) => {
                        return <div key={'error-' + index}>{value.message}</div>;
                    })}
                </Alert>
            ) : (
                <></>
            )}

            {warning.length > 0 ? (
                <Alert className="m-3" key="warning" variant="warning">
                    {warning.map((value, index) => {
                        return <div key={'warning-' + index}>{value}</div>;
                    })}
                </Alert>
            ) : (
                <></>
            )}

            {success.length > 0 ? (
                <Alert className="m-3" key="success" variant="success">
                    {success.map((value, index) => {
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
