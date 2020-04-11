import React, { useState } from "react";
import { useStateValue, LogoutStateAction } from "../State";

import styled from 'styled-components';
import { Form, Button, Jumbotron, Container } from "react-bootstrap";

import { MessageBanner } from "../banner/MessageBanner";

import { forgotPasswordCodeRequest, forgotPasswordConfirm } from "../../utils/Auth";
import { Redirect } from "react-router-dom";

const Styled = styled.div`
`;

export const ForgotPassword = () => {
    const [stage, setStage] = useState(1); // 1 = email stage, 2 = code stage, 3 = changed stage
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState<Error>();

    const [, dispatch] = useStateValue();

    const sendCode = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        forgotPasswordCodeRequest(email)
            .then(() => setStage(2))
            .catch(err => setError(err));
    };

    const resetPassword = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setError(new Error("Passwords are not the same"));
            return;
        }

        forgotPasswordConfirm(email, code, newPassword)
            .then(() => setStage(3))
            .then(() => dispatch(LogoutStateAction()))
            .catch(err => setError(err));
    };

    if (stage === 3) {
        return (<Redirect to="/login" />);
    }

    return (

        <Styled>

            {error ? <MessageBanner errors={[error]} /> : <></>}

            <Container className="d-flex mt-5 justify-content-center">

                <Jumbotron className="m-0 p-5" style={{
                    width: "400px"
                }}>

                    <h1>Forgot Password</h1>
                    {stage === 1 && (
                        <Form onSubmit={sendCode}>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    autoComplete="username"
                                    placeholder="Enter email"
                                    onChange={(event: React.FormEvent<HTMLInputElement>) => setEmail(event.currentTarget.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicSendCode">
                                <Button variant="primary" type="submit">Submit</Button>
                            </Form.Group>
                        </Form>
                    )}
                    {stage === 2 && (
                        <Form onSubmit={resetPassword}>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoComplete=""
                                    placeholder="Enter code"
                                    onChange={(event: React.FormEvent<HTMLInputElement>) => setCode(event.currentTarget.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicNewPassword">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    autoComplete=""
                                    placeholder="Enter New Password"
                                    onChange={(event: React.FormEvent<HTMLInputElement>) => setNewPassword(event.currentTarget.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicConfirmNewPassword">
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    autoComplete=""
                                    placeholder="Confirm New Password"
                                    onChange={(event: React.FormEvent<HTMLInputElement>) => setConfirmPassword(event.currentTarget.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicChangePassword">
                                <Button variant="primary" type="submit">Submit</Button>
                            </Form.Group>

                        </Form>
                    )}

                </Jumbotron>
            </Container>

        </Styled >




    );
};

export default ForgotPassword;

/*

        <div>

            {error ? <ErrorBanner errors={[error]} /> : <></>}

            <h1>Forgot Password</h1>
            {stage === 1 && (
                <form onSubmit={sendCode} >

                    <input
                        placeholder="Email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                    />

                    <button type="submit">Send verification code</button>

                </form>
            )}
            {stage === 2 && (
                <form onSubmit={resetPassword}>

                    <input
                        placeholder="Code"
                        value={code}
                        onChange={event => setCode(event.target.value)}
                    />

                    <input
                        placeholder="New Password"
                        value={newPassword}
                        onChange={event => setNewPassword(event.target.value)}
                    />

                    <input
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={event => setConfirmPassword(event.target.value)}
                    />

                    <button type="submit">Change Password</button>

                </form>

            )}

        </div >


*/