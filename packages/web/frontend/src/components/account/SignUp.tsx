import React, { useState } from 'react';
import { signup } from '../../utils/Auth';
import { Container, Jumbotron, Form, Button } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import ErrorBanner from '../banner/ErrorBanner';

const Styled = styled.div`
`;


export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<Error>();
    const [signupSuccess, setSignupSuccess] = useState(false);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        signup(email, name, password)
            .then(() => setSignupSuccess(true))
            .catch(err => setError(err));
    };

    if (signupSuccess) {
        return (<Redirect to="/login" />);
    }

    return (

        <Styled>

            {error ? <ErrorBanner errors={[error]} /> : <></>}

            <Container className="d-flex mt-5 justify-content-center">

                <Jumbotron className="m-0 p-5" style={{
                    width: "400px"
                }}>

                    <h1>Sign Up</h1>
                    <Form onSubmit={onSubmit}>

                        <Form.Group controlId="formSignUpEmail">
                            <Form.Label>Email address *</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                autoComplete="username"
                                placeholder="Enter email"
                                onChange={(event: React.FormEvent<HTMLInputElement>) => setEmail(event.currentTarget.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formSignUpName">
                            <Form.Label>Name *</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                autoComplete="name"
                                placeholder="Enter name"
                                onChange={(event: React.FormEvent<HTMLInputElement>) => setName(event.currentTarget.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formSignUpPassword">
                            <Form.Label>Password *</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter password"
                                onChange={(event: React.FormEvent<HTMLInputElement>) => setPassword(event.currentTarget.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formSignUpConfirmPassword">
                            <Form.Label>Confirm Password *</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                autoComplete="current-password"
                                placeholder="Repeat Password"
                                onChange={(event: React.FormEvent<HTMLInputElement>) => setPassword(event.currentTarget.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formSignUpSubmit">
                            <Button variant="primary" type="submit">Submit</Button>
                        </Form.Group>

                        <Form.Group controlId="formSignUpLogin">
                            <Link to="/login">Do you already have an account?</Link>
                        </Form.Group>

                    </Form>
                </Jumbotron>
            </Container>

        </Styled>

    );

};

export default SignUp;