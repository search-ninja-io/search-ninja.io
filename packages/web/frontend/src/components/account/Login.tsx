import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Form, Button, Jumbotron, Container } from 'react-bootstrap';
import styled from 'styled-components';
import { useSessionStore } from '../../state/SessionStore';
import { MessageBanner } from '../banner/MessageBanner';
import { LoginResultTotpRequired } from '../../auth/Auth';

const Styled = styled.div``;

export const Login = (): JSX.Element => {
    const [showMfaForm, setShowMfaForm] = useState<LoginResultTotpRequired>();
    const [, sessionActions] = useSessionStore();

    if (sessionActions.isUserLoggedIn()) {
        return <Redirect to="/home" />;
    } else if (showMfaForm) {
        return <MfaForm data={showMfaForm} />;
    }
    return <LoginForm showMfaForm={setShowMfaForm} />;
};

interface LoginFormProps {
    showMfaForm: (data: LoginResultTotpRequired) => void;
}

const LoginForm = (props: LoginFormProps): JSX.Element => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberDevice, setRememberDevice] = useState(false);

    const [error, setError] = useState<Error>();

    const [, sessionActions] = useSessionStore();

    const onSubmitLogin = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        sessionActions
            .login(username, password, rememberDevice)
            .then((result) => {
                if (result) props.showMfaForm(result);
            })
            .catch((err) => setError(err));
    };

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
                    <h2>Login</h2>
                    <Form className="mt-3" onSubmit={onSubmitLogin}>
                        <Form.Group controlId="formLoginEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
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

interface MfaFormProps {
    data: LoginResultTotpRequired;
}

const MfaForm = (props: MfaFormProps): JSX.Element => {
    const [mfaCode, setMfaCode] = useState('');
    const [error, setError] = useState<Error>();

    const [, sessionActions] = useSessionStore();

    const onSubmitMfa = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        sessionActions.verifyToken(mfaCode, props.data).catch((err) => setError(err));
    };

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
                    <h2>MFA</h2>
                    <Form className="mt-3" onSubmit={onSubmitMfa}>
                        <Form.Group controlId="formLoginMfaDevice">
                            <Form.Label>
                                Device
                                <br />
                                {props.data.device}
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

export default Login;
