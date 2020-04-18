import React, { useState } from 'react';
import { useSessionStore } from '../../state/SessionStore';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

export const ChangePassword = (): JSX.Element => {
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
            sessionActions.setError(new Error('New Password and Confirm Password are not the same.'));
            return;
        }

        setPassword('');
        setNewPassword('');
        setConfirmNewPassword('');

        sessionActions
            .changePassword(password, newPassword)
            .then(() => sessionActions.setSuccess('Successfully changed password. Please login again.'))
            .catch((err) => sessionActions.setError(err));
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
