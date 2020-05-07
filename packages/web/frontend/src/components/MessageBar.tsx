import React from 'react';
import { Alert, Form, Row, Col, Button } from 'react-bootstrap';
import { useGlobalStore } from '../utils/store';
import { useAuth0 } from '../auth/Auth0Context';

export const MessageBar: React.FC = () => {
    const [state] = useGlobalStore();

    const success = state.message?.success ? state.message.success : [];
    const warning = state.message?.warning ? state.message.warning : [];
    const error = state.message?.error ? state.message.error : [];

    const { isAuthenticated, user } = useAuth0();

    const EmailVerificationTask: React.FC = () => {
        if (!isAuthenticated || !user || user.email_verified) return null;

        const onResendClick = async (): Promise<void> => {
            console.log('resend');
        };

        return (
            <Alert className="m-3" variant="primary">
                <h4>Email Verification Task</h4>
                <p>Please check your emails and follow the instructions to verify your email address.</p>
                <p>
                    If you did not receive the email or already deleted it, reset your password by either click on the
                    forget password link in the login form where you receive an email with instructions or use the
                    button below.
                </p>
                <Button onClick={onResendClick}>Reset Password</Button>
            </Alert>
        );
    };

    const CompleteProfileTask: React.FC = () => {
        if (!isAuthenticated || !user || (user.family_name && user.given_name && name !== user.email)) return null;

        const onSubmit = (): void => {
            console.log('submit');
        };

        return (
            <Alert className="m-3" variant="primary">
                <h4>Complete Profile Task</h4>
                <p>Please provide your first and last name.</p>
                <Form onSubmit={onSubmit}>
                    <Row>
                        <Col>
                            <Form.Label>First name *</Form.Label>
                            <Form.Control required placeholder="Enter first name" value={user.given_name} />
                        </Col>
                        <Col>
                            <Form.Label>Last name *</Form.Label>
                            <Form.Control required placeholder="Enter last name" value={user.family_name} />
                        </Col>
                    </Row>
                    <Row className="mt-3 mb-3">
                        <Col>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Alert>
        );
    };

    const tasks = [<EmailVerificationTask key="task-1" />, <CompleteProfileTask key="task-2" />];

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

            {tasks.map((value) => value)}
        </>
    );
};

export default MessageBar;
