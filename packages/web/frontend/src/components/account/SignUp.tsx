import React, { useState } from 'react';
import { signup } from '../../auth/Auth';
import { Container, Jumbotron, Form, Button } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { MessageBanner } from '../banner/MessageBanner';

const Styled = styled.div``;

export const SignUp = (): JSX.Element => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState<Error>();
    const [signupSuccess, setSignupSuccess] = useState(false);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        signup(email, name, password)
            .then(() => setSignupSuccess(true))
            .catch((err) => setError(err));
    };

    if (signupSuccess) {
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
                    <h1>Sign Up</h1>
                    <Form onSubmit={onSubmit}>
                        <Form.Group controlId="formSignUpEmail">
                            <Form.Label>Email address *</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                autoComplete="username"
                                placeholder="Enter email"
                                onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                                    setEmail(event.currentTarget.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="formSignUpName">
                            <Form.Label>Name *</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                autoComplete="name"
                                placeholder="Enter name"
                                onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                                    setName(event.currentTarget.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="formSignUpPassword">
                            <Form.Label>Password *</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter password"
                                onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                                    setPassword(event.currentTarget.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="formSignUpConfirmPassword">
                            <Form.Label>Confirm Password *</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                autoComplete="current-password"
                                placeholder="Repeat Password"
                                onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                                    setPassword(event.currentTarget.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="formSignUpSubmit">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
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
