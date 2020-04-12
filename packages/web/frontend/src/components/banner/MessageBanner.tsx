import React from 'react';
import { Alert } from 'react-bootstrap';

export interface MessageBannerProps {
    successes?: string[];
    warnings?: string[];
    errors?: Error[];
}

export const MessageBanner = (props: MessageBannerProps): JSX.Element => {
    return (
        <>
            {props.errors && props.errors.length > 0 ? (
                <Alert className="m-3" key="error" variant="danger">
                    {props.errors.map((value, index) => {
                        return <div key={'error-' + index}>{value.message}</div>;
                    })}
                </Alert>
            ) : (
                <></>
            )}

            {props.warnings && props.warnings.length > 0 ? (
                <Alert className="m-3" key="warning" variant="warning">
                    {props.warnings.map((value, index) => {
                        return <div key={'warning-' + index}>{value}</div>;
                    })}
                </Alert>
            ) : (
                <></>
            )}

            {props.successes && props.successes.length > 0 ? (
                <Alert className="m-3" key="success" variant="success">
                    {props.successes.map((value, index) => {
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
