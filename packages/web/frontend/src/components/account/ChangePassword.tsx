import React, { useState } from 'react';
import { State } from '../../store';
import { Form, Button } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { Actions } from '../../actions';

export const ChangePassword = (props: { sessionStore: [State, Actions] } & RouteComponentProps): JSX.Element => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [{ session }, actions] = props.sessionStore;

    const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (newPassword !== confirmNewPassword) {
            actions.setError(new Error('New Password and Confirm Password are not the same.'));
            return;
        }

        setPassword('');
        setNewPassword('');
        setConfirmNewPassword('');

        actions
            .changePassword(password, newPassword)
            .then(() => actions.setSuccess('Successfully changed password. Please login again.'))
            .then(() => props.history.push('/login'))
            .catch((err) => actions.setError(err));
    };

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
