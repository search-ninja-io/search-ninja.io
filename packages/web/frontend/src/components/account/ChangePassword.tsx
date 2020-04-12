import React, { useState } from 'react';
import { useStateValue, LogoutStateAction } from '../State';
import { changePassword } from '../../utils/Auth';
import { Form, Button } from 'react-bootstrap';
import { MessageBannerProps } from '../banner/MessageBanner';

interface ChangePasswordProps {
    setMessage: React.Dispatch<React.SetStateAction<MessageBannerProps>>;
}

export const ChangePassword = (props: ChangePasswordProps): JSX.Element => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [{ session }, dispatch] = useStateValue();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (!session) {
            // FIXME: Does not work, fix it!
            // return <Redirect to="/login" />;
            return;
        }

        if (newPassword !== confirmNewPassword) {
            props.setMessage({ errors: [new Error('New Password and Confirm Password are not the same.')] });
            return;
        }

        changePassword(session, password, newPassword)
            .then(() => {
                props.setMessage({ successes: ['Successfully changed password.'] });
                setPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                dispatch(LogoutStateAction());
            })
            .catch((err) => props.setMessage({ errors: [err] }));
    };

    console.log('ChangePassword.render', password, newPassword, confirmNewPassword);

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
