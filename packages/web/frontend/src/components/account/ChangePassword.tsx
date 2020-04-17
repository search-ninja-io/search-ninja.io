import React, { useState } from 'react';
import { useSessionStore } from '../../state/SessionStore';
import { Form, Button } from 'react-bootstrap';
import { MessageBannerProps } from '../banner/MessageBanner';
import { Redirect } from 'react-router-dom';

interface ChangePasswordProps {
    setMessage: React.Dispatch<React.SetStateAction<MessageBannerProps>>;
}

export const ChangePassword = (props: ChangePasswordProps): JSX.Element => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [{ session }, sessionActions] = useSessionStore();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (!sessionActions.isUserLoggedIn() || !session) {
            return;
        }

        if (newPassword !== confirmNewPassword) {
            props.setMessage({ errors: [new Error('New Password and Confirm Password are not the same.')] });
            return;
        }

        setPassword('');
        setNewPassword('');
        setConfirmNewPassword('');

        sessionActions
            .changePassword(password, newPassword)
            .then(() => props.setMessage({ successes: ['Successfully changed password.'] }))
            .catch((err) => props.setMessage({ errors: [err] }));
    };

    if (!session) {
        return <Redirect to="/login" />;
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Control
                    readOnly
                    style={{ display: ' none' }}
                    type="text"
                    name="username"
                    autoComplete="username email"
                    value={session ? session.userAttributes['email'] : ''}
                />

                <Form.Group controlId="formChangePasswordCurrentPassword">
                    <Form.Label>Current Password *</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter current password"
                        onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                            setPassword(event.currentTarget.value)
                        }
                    />
                </Form.Group>

                <Form.Group controlId="formChangePasswordNewPassword">
                    <Form.Label>New Password *</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        autoComplete=""
                        placeholder="Enter new password"
                        onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                            setNewPassword(event.currentTarget.value)
                        }
                    />
                </Form.Group>

                <Form.Group controlId="formChangePasswordConfirmNewPassword">
                    <Form.Label>Confirm New Password *</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        autoComplete=""
                        placeholder="Confirm new password"
                        onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                            setConfirmNewPassword(event.currentTarget.value)
                        }
                    />
                </Form.Group>

                <Form.Group controlId="formChangePasswordSubmit">
                    <Button variant="primary" type="submit">
                        Change Password
                    </Button>
                </Form.Group>
            </Form>
        </>
    );
};

export default ChangePassword;
