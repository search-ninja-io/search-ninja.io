import React, { useState } from 'react';
import { StaticContext } from 'react-router';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Form, Button, Jumbotron, Container } from 'react-bootstrap';
import styled from 'styled-components';
import { useGlobalStore } from '../../store';

const Styled = styled.div``;

type LoginProps = RouteComponentProps<
    {},
    StaticContext,
    { referrer: { pathname: string; search: string; hash: string } }
>;

export const Login = (props: LoginProps): JSX.Element => {
    const [{ totpSession }, actions] = useGlobalStore();
    const { referrer } = props.location.state || { referrer: { pathname: '/' } };

    const LoginForm = (props: RouteComponentProps): JSX.Element => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [rememberDevice, setRememberDevice] = useState(false);

        const onSubmitLogin = (event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault();
            actions
                .login(username, password, rememberDevice)
                .then((totpRequired) => {
                    if (!totpRequired) props.history.push(referrer);
                })
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
                        <h2>Login</h2>
                        <Form className="mt-3" onSubmit={onSubmitLogin}>
                            <Form.Group controlId="formLoginEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    autoFocus
                                    type="email"
                                    value={username}
                                    autoComplete="username"
                                    placeholder="Enter email"
                                    onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                                        setUsername(event.currentTarget.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formLoginPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                                        setPassword(event.currentTarget.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formRememberDevice">
                                <Form.Check
                                    type="switch"
                                    checked={rememberDevice}
                                    label="Remember Device"
                                    placeholder="Remeber Device"
                                    onChange={(): void => setRememberDevice(!rememberDevice)}
                                />
                            </Form.Group>

                            <Form.Group controlId="formLoginSubmit">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form.Group>

                            <Form.Group controlId="formLoginForgotPassword">
                                <Link to="/forgotpassword">Forgot password?</Link>
                            </Form.Group>
                        </Form>
                    </Jumbotron>
                </Container>
            </Styled>
        );
    };

    const MfaForm = (props: RouteComponentProps): JSX.Element => {
        const [mfaCode, setMfaCode] = useState('');

        const onSubmitMfa = (event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault();
            actions
                .sendSoftwareToken(mfaCode)
                .then(() => props.history.push(referrer))
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
                        <h2>MFA</h2>
                        <Form className="mt-3" onSubmit={onSubmitMfa}>
                            <Form.Group controlId="formLoginMfaDevice">
                                <Form.Label>
                                    Device
                                    <br />
                                    {totpSession ? totpSession.device : 'n/a'}
                                </Form.Label>
                            </Form.Group>

                            <Form.Group controlId="formLoginMfaCode">
                                <Form.Label>Verification Token *</Form.Label>
                                <Form.Control
                                    required
                                    autoFocus
                                    type="text"
                                    autoComplete="one-time-code"
                                    placeholder="Enter Verification Token"
                                    onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                                        setMfaCode(event.currentTarget.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formLoginMfaSubmit">
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

    if (totpSession) {
        return <MfaForm {...props} />;
    }
    return <LoginForm {...props} />;
};

export default Login;
