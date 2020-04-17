import React, { useState } from 'react';
import { Button, Container, Form, Jumbotron } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { MessageBanner } from '../banner/MessageBanner';
import { useSessionStore } from '../../state/SessionStore';

const Styled = styled.div``;

enum Stage {
    Email = 1,
    Code = 2,
    Changed = 3,
}

export const ForgotPassword = (): JSX.Element => {
    const [stage, setStage] = useState(Stage.Email);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState<Error>();

    const [, sessionActions] = useSessionStore();

    const sendCode = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        sessionActions
            .forgotPasswordCodeRequest(email)
            .then(() => setStage(Stage.Code))
            .catch((err) => setError(err));
    };

    const resetPassword = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setError(new Error('Passwords are not the same'));
            return;
        }

        sessionActions
            .forgotPasswordConfirm(email, code, newPassword)
            .then(() => setStage(Stage.Changed))
            .catch((err) => setError(err));
    };

    if (stage === Stage.Changed) {
        return <Redirect to="/login" />;
    }

    return (
        <Styled>
            {error ? <MessageBanner errors={[error]} /> : <></>}

            <Container className="d-flex mt-5 justify-content-center">
                <Jumbotron
                    className="m-0 p-5"
                    style={{
                        width: '400px',
                    }}
                >
                    <h1>Forgot Password</h1>
                    {stage === Stage.Email && (
                        <Form onSubmit={sendCode}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    autoComplete="username"
                                    placeholder="Enter email"
                                    onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                                        setEmail(event.currentTarget.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicSendCode">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form.Group>
                        </Form>
                    )}
                    {stage === Stage.Code && (
                        <Form onSubmit={resetPassword}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoComplete=""
                                    placeholder="Enter code"
                                    onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                                        setCode(event.currentTarget.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicNewPassword">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    autoComplete=""
                                    placeholder="Enter New Password"
                                    onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                                        setNewPassword(event.currentTarget.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicConfirmNewPassword">
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    autoComplete=""
                                    placeholder="Confirm New Password"
                                    onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                                        setConfirmPassword(event.currentTarget.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicChangePassword">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form.Group>
                        </Form>
                    )}
                </Jumbotron>
            </Container>
        </Styled>
    );
};

export default ForgotPassword;
