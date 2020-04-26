import React, { useState } from 'react';
import { StaticContext } from 'react-router';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Form, Button, Jumbotron, Container } from 'react-bootstrap';
import styled from 'styled-components';
import { useGlobalStore } from '../../state';

import { SignInResponseType } from '../../actions';
import { Auth, Cache } from 'aws-amplify';

import { withOAuth } from 'aws-amplify-react';

const Styled = styled.div``;

type SignInProps = RouteComponentProps<
    {},
    StaticContext,
    { referrer: { pathname: string; search: string; hash: string } }
>;

enum DisplayMode {
    SignIn = 1,
    Totp = 2,
}

const SignInInternal = (props: SignInProps): JSX.Element => {
    const [, actions] = useGlobalStore();
    const { referrer } = props.location.state || { referrer: { pathname: '/' } };

    const [{ mode, user }, setDisplayMode] = useState<{
        mode: DisplayMode;
        user?: unknown;
    }>({
        mode: DisplayMode.SignIn,
    });

    const SignInForm = (): JSX.Element => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');

        const onSubmitSignIn = (event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault();
            actions
                .signIn(username, password, referrer)
                .then(({ response, user }) => {
                    if (response === SignInResponseType.TOTP) {
                        setDisplayMode({ mode: DisplayMode.Totp, user: user });
                    }
                })
                .catch((err) => actions.setError(err));
        };

        const onClickFederatedGoogleSignIn = (event: React.MouseEvent<HTMLButtonElement>): void => {
            event.preventDefault();
            actions.federatedGoogleSignIn().catch((err) => actions.setError(err));
        };

        const checkUser = async (): Promise<void> => {
            try {
                const user = await Auth.currentAuthenticatedUser({ bypassCache: false });
                console.log('checkUser:', user);

                const federatedInfo = await Cache.getItem('federatedInfo');
                console.log('federatedInfo:', federatedInfo);
            } catch (error) {
                console.log('checkUser:', error);
            }
        };

        const signOut = async (): Promise<void> => {
            await actions.signOut();
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
                        <h2>Sign In</h2>
                        <Form className="mt-3" onSubmit={onSubmitSignIn}>
                            <Form.Group controlId="formSignInEmail">
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

                            <Form.Group controlId="formSignInPassword">
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

                            <Form.Group controlId="formSignInSubmit">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form.Group>

                            <Form.Group controlId="formSignInForgotPassword">
                                <Link to="/forgotpassword">Forgot password?</Link>
                            </Form.Group>

                            <Form.Group
                                className="mt-4 d-flex justify-content-between"
                                controlId="formSignInTotpSubmit"
                            >
                                <Button
                                    className="col-3"
                                    variant="primary"
                                    type="button"
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>): void =>
                                        onClickFederatedGoogleSignIn(event)
                                    }
                                >
                                    Google
                                </Button>
                                <Button className="col-3" variant="primary" type="button" onClick={checkUser}>
                                    Check User
                                </Button>
                                <Button className="col-3" variant="primary" type="button" onClick={signOut}>
                                    Sign Out
                                </Button>
                            </Form.Group>
                        </Form>
                    </Jumbotron>
                </Container>
            </Styled>
        );
    };

    const TotpForm = (): JSX.Element => {
        const [verificationCode, setVerificationCode] = useState('');

        const onSubmitTotp = (event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault();
            actions.confirmSignIn(user, verificationCode, referrer).catch((err) => actions.setError(err));
        };

        const onClickCancel = (event: React.MouseEvent<HTMLButtonElement>): void => {
            event.preventDefault();
            setDisplayMode({ mode: DisplayMode.SignIn });
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
                        <Form className="mt-3" onSubmit={onSubmitTotp}>
                            <Form.Group controlId="formSignInTotpCode">
                                <Form.Label>Verification Token *</Form.Label>
                                <Form.Control
                                    required
                                    autoFocus
                                    type="text"
                                    autoComplete="one-time-code"
                                    placeholder="Enter Verification Token"
                                    onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                                        setVerificationCode(event.currentTarget.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group
                                className="mt-4 d-flex justify-content-between"
                                controlId="formSignInTotpSubmit"
                            >
                                <Button className="col-4" variant="primary" type="submit">
                                    Submit
                                </Button>
                                <Button
                                    className="col-4"
                                    variant="secondary"
                                    type="button"
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>): void => onClickCancel(event)}
                                >
                                    Cancel
                                </Button>
                            </Form.Group>
                        </Form>
                    </Jumbotron>
                </Container>
            </Styled>
        );
    };

    if (mode === DisplayMode.Totp) {
        return <TotpForm />;
    }
    return <SignInForm />;
};

export const SignIn = withOAuth(SignInInternal);

export default SignIn;
