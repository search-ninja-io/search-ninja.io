import React, { useState } from 'react';
import { Button, Container, Form, Jumbotron } from 'react-bootstrap';
import styled from 'styled-components';
import { useGlobalStore } from '../../state';

const Styled = styled.div``;

enum Stage {
    Email = 1,
    Code = 2,
}

export const ForgotPassword = (): JSX.Element => {
    const [stage, setStage] = useState(Stage.Email);
    const [email, setEmail] = useState('');

    const [, actions] = useGlobalStore();

    const ForgotPasswordEmail = (): JSX.Element => {
        const sendCode = (event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault();
            actions
                .forgotPassword(email)
                .then(() => setStage(Stage.Code))
                .then(() => actions.setSuccess('Recovery Code has been sent to your email address.'))
                .catch((err) => actions.setError(err));
        };

        return (
            <Styled>
                <Container className="d-flex mt-5 justify-content-center">
                    <Jumbotron
                        className="m-0 p-5"
                        style={{
                            width: '400px',
                        }}
                    >
                        <h1>Forgot Password</h1>
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
                    </Jumbotron>
                </Container>
            </Styled>
        );
    };

    const ForgotPasswordCode = (): JSX.Element => {
        const [code, setCode] = useState('');
        const [newPassword, setNewPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');

        const resetPassword = (event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault();

            if (newPassword !== confirmPassword) {
                actions.setError('Passwords are not the same');
                return;
            }

            actions
                .forgotPasswordSubmit(email, code, newPassword)
                .then(() => actions.setSuccess('Password successfully recovered. Plaes sign in with the new password.'))
                .catch((err) => actions.setError(err));
        };
        return (
            <Styled>
                <Container className="d-flex mt-5 justify-content-center">
                    <Jumbotron
                        className="m-0 p-5"
                        style={{
                            width: '400px',
                        }}
                    >
                        <h1>Forgot Password</h1>
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
                    </Jumbotron>
                </Container>
            </Styled>
        );
    };

    if (stage === Stage.Email) {
        return <ForgotPasswordEmail />;
    } else {
        return <ForgotPasswordCode />;
    }
};

export default ForgotPassword;
