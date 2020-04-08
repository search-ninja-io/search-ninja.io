import React, { useState } from "react";
import { useStateValue, LogoutStateAction } from "../State";
import { changePassword } from "../../utils/Auth";
import { Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";

interface ChangePasswordProps {
    setError: React.Dispatch<React.SetStateAction<Error | undefined>>;
}

export const ChangePassword = (props: ChangePasswordProps) => {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [{ session }, dispatch] = useStateValue();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!session) {
            return (<Redirect to="/login" />);
        }

        if (newPassword !== confirmNewPassword) {
            props.setError(new Error("New Password and Confirm Password are not the same."));
        }

        changePassword(session, password, newPassword)
            .then(() => dispatch(LogoutStateAction()))
            .catch(err => props.setError(err));

    };

    return (
        <>
            <Form onSubmit={onSubmit}>

                <Form.Control
                    readOnly
                    style={{ display: " none" }}
                    type="text"
                    name="username"
                    autoComplete="username email"
                    value={(session ? session.userAttributes["email"] : "")}
                />

                <Form.Group controlId="formChangePasswordCurrentPassword">
                    <Form.Label>Current Password *</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter current password"
                        onChange={(event: React.FormEvent<HTMLInputElement>) => setPassword(event.currentTarget.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formChangePasswordNewPassword">
                    <Form.Label>New Password *</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        autoComplete=""
                        placeholder="Enter new password"
                        onChange={(event: React.FormEvent<HTMLInputElement>) => setNewPassword(event.currentTarget.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formChangePasswordConfirmNewPassword">
                    <Form.Label>Confirm New Password *</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        autoComplete=""
                        placeholder="Confirm new password"
                        onChange={(event: React.FormEvent<HTMLInputElement>) => setConfirmNewPassword(event.currentTarget.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formChangePasswordSubmit">
                    <Button variant="primary" type="submit">Change Password</Button>
                </Form.Group>

            </Form>

        </>
    );
};

export default ChangePassword;