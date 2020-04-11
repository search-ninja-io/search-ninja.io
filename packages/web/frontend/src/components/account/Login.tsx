import React, { useState } from "react";
import { login, sendSoftwareToken, LoginResultBase, LoginResult, LoginResultTotpRequired, MfaResult } from "../../utils/Auth";
import { useStateValue, LoginStateAction } from "../State";
import { Redirect, Link } from "react-router-dom";

import styled from 'styled-components';
import { Form, Button, Jumbotron, Container } from "react-bootstrap";

import { MessageBanner } from "../banner/MessageBanner";
import { CognitoUser } from "amazon-cognito-identity-js";

const Styled = styled.div`
`;

enum DisplayMode {
    Login = 1,
    Mfa = 2
}

interface DisplayModeState {
    displayMode: DisplayMode.Login | DisplayMode.Mfa;
}

interface DisplayModeLoginState extends DisplayModeState {
    displayMode: DisplayMode.Login;
    err?: Error;
}

interface DisplayModeMfaState extends DisplayModeState {
    displayMode: DisplayMode.Mfa;
    user: CognitoUser;
    device: string;
    err?: Error;
}

export const Login = () => {

    const [displayModeState, setDisplayModeState] = useState<DisplayModeLoginState | DisplayModeMfaState>({ displayMode: DisplayMode.Login });
    const [{ session }, dispatch] = useStateValue();

    if (session) {
        return (<Redirect to="/home" />);
    }

    const handleLoginResult = (err?: Error, loginResult?: LoginResultBase) => {
        if (err || !loginResult) {
            setDisplayModeState({
                ...displayModeState,
                err: (err ? err : new Error("No Login Result returned, this should not happen, but it does!"))
            });
        }
        else if (loginResult.type === "LoginResultTotpRequired") {
            const { user, device } = (loginResult as LoginResultTotpRequired);
            setDisplayModeState({
                displayMode: DisplayMode.Mfa,
                user: user,
                device: device
            });
        }
        else { //if (loginResult.type === "LoginResult") {
            const { session } = (loginResult as LoginResult);
            dispatch(LoginStateAction(session));
        }

    };

    const handleMfaResult = (err?: Error, mfaResult?: MfaResult) => {
        if (err || !mfaResult) {
            setDisplayModeState({
                ...displayModeState,
                displayMode: DisplayMode.Login,
                err: (err ? err : new Error("No Login Result returned, this should not happen, but it does!"))
            });
        }
        else {
            dispatch(LoginStateAction(mfaResult.session));
        }
    };

    if (displayModeState.displayMode === DisplayMode.Login) {
        return (<LoginForm callback={handleLoginResult} error={displayModeState.err} />);
    }
    else { //if (displayModeState.displayMode === DisplayMode.Mfa) {
        return (<MfaForm user={displayModeState.user} device={displayModeState.device} callback={handleMfaResult} error={displayModeState.err} />);
    }
};

interface LoginFormProps {
    error?: Error;
    callback: (err?: Error, loginResult?: LoginResultBase) => void;
}

const LoginForm = (props: LoginFormProps) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberDevice, setRememberDevice] = useState(false);

    const [error, setError] = useState<Error | undefined>(props.error);

    const onSubmitLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        login(email, password, rememberDevice)
            .then(loginResult => props.callback(undefined, loginResult))
            .catch(err => setError(err));
    };

    return (

        <Styled>

            {error ? <MessageBanner errors={[error]} /> : <></>}

            <Container className="d-flex mt-5 justify-content-center">

                <Jumbotron className="m-0 p-5" style={{
                    width: "400px"
                }}>

                    <h2>Login</h2>
                    <Form className="mt-3" onSubmit={onSubmitLogin}>

                        <Form.Group controlId="formLoginEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                autoComplete="username"
                                placeholder="Enter email"
                                onChange={(event: React.FormEvent<HTMLInputElement>) => setEmail(event.currentTarget.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formLoginPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                autoComplete="current-password"
                                placeholder="Password"
                                onChange={(event: React.FormEvent<HTMLInputElement>) => setPassword(event.currentTarget.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formRememberDevice">
                            <Form.Check
                                type="switch"
                                checked={rememberDevice}
                                label="Remember Device"
                                placeholder="Remeber Device"
                                onChange={(event: React.FormEvent<HTMLInputElement>) => setRememberDevice(!rememberDevice)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formLoginSubmit">
                            <Button variant="primary" type="submit">Submit</Button>
                        </Form.Group>

                        <Form.Group controlId="formLoginForgotPassword">
                            <Link to="/forgotpassword">Forgot password?</Link>
                        </Form.Group>

                    </Form>
                </Jumbotron>
            </Container>

        </Styled >
    );
};

interface MfaFormProps {
    user: CognitoUser;
    device: string;
    error?: Error;
    callback: (err?: Error, mfaResult?: MfaResult) => void;
}

const MfaForm = (props: MfaFormProps) => {

    const [mfaCode, setMfaCode] = useState("");
    const [error,] = useState<Error | undefined>(props.error);

    const onSubmitMfa = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendSoftwareToken(props.user, mfaCode)
            .then(mfaResult => props.callback(undefined, mfaResult))
            .catch(err => props.callback(err, undefined));
    };

    return (
        <Styled>

            {error ? <MessageBanner errors={[error]} /> : <></>}

            <Container className="d-flex mt-5 justify-content-center">

                <Jumbotron className="m-0 p-5" style={{
                    width: "400px"
                }}>

                    <h2>MFA</h2>
                    <Form className="mt-3" onSubmit={onSubmitMfa}>

                        <Form.Group controlId="formLoginMfaDevice">
                            <Form.Label>Device<br />{props.device}</Form.Label>
                        </Form.Group>

                        <Form.Group controlId="formLoginMfaCode">
                            <Form.Label>Verification Token *</Form.Label>
                            <Form.Control
                                required
                                autoFocus
                                type="text"
                                autoComplete="one-time-code"
                                placeholder="Enter Verification Token"
                                onChange={(event: React.FormEvent<HTMLInputElement>) => setMfaCode(event.currentTarget.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formLoginMfaSubmit">
                            <Button variant="primary" type="submit">Submit</Button>
                        </Form.Group>

                    </Form>
                </Jumbotron>
            </Container>

        </Styled>
    );
};


export default Login;