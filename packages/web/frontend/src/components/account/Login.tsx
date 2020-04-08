import React, { useState } from "react";
import { login } from "../../utils/Auth";
import { useStateValue, LoginStateAction } from "../State";
import { Redirect, Link } from "react-router-dom";

import styled from 'styled-components';
import { Form, Button, Jumbotron, Container } from "react-bootstrap";

import { ErrorBanner } from "../banner/ErrorBanner";

const Styled = styled.div`
`;


export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<Error>();

    const [{ session }, dispatch] = useStateValue();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        login(email, password)
            .then(session => dispatch(LoginStateAction(session)))
            .catch(err => setError(err));
    };

    if (session) {
        return (<Redirect to="/home" />);
    }

    return (

        <Styled>

            {error ? <ErrorBanner errors={[error]} /> : <></>}

            <Container className="d-flex mt-5 justify-content-center">

                <Jumbotron className="m-0 p-5" style={{
                    width: "400px"
                }}>

                    <h1>Login</h1>
                    <Form onSubmit={onSubmit}>

                        <Form.Group controlId="formLoginEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                autoComplete="username"
                                placeholder="Enter email"
                                onChange={(event: React.FormEvent<HTMLInputElement>) => setEmail(event.currentTarget.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formLoginPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                autoComplete="current-password"
                                placeholder="Password"
                                onChange={(event: React.FormEvent<HTMLInputElement>) => setPassword(event.currentTarget.value)}
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

export default Login;