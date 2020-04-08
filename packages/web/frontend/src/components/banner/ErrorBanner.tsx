import React from "react";
import { Alert } from "react-bootstrap";

interface ErrorProps {
    errors: Error[];
}

export const ErrorBanner = (props: ErrorProps) => {

    if (props.errors.length === 0) {
        return (
            <></>
        );
    }

    return (
        <Alert className="m-3" key="error" variant="danger">
            {props.errors.map((value, index) => {
                return <div key={"error-" + index}>{value.message}</div>;
            })}
        </Alert>
    );
};

export default ErrorBanner;