import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { Actions } from '../../actions';
import { State } from '../../state';

export const ChangePassword = (props: { store: [State, Actions] } & RouteComponentProps): JSX.Element => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [{ currentUserDetails }, actions] = props.store;

    const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (newPassword !== confirmNewPassword) {
            actions.setError('New Password and Confirm Password are not the same.');
            return;
        }

        setPassword('');
        setNewPassword('');
        setConfirmNewPassword('');

        actions
            .changePassword(password, newPassword)
            .then(() => actions.setSuccess('Successfully changed password. Please login again.'))
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
                    value={currentUserDetails ? currentUserDetails.email : ''}
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
