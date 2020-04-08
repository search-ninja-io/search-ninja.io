import React, { useState } from "react";
import { useStateValue, LogoutStateAction } from "../State";
import { changeEmail } from "../../utils/Auth";
import { Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";

interface ChangeEmailProps {
    setError: React.Dispatch<React.SetStateAction<Error | undefined>>;
}


export const ChangeEmail = (props: ChangeEmailProps) => {
    const [newEmail, setNewEmail] = useState("");
    const [confirmNewEmail, setConfirmNewEmail] = useState("");
    const [password, setPassword] = useState("");

    const [{ session }, dispatch] = useStateValue();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!session) {
            return (<Redirect to="/login" />);
        }

        if (newEmail !== confirmNewEmail) {
            props.setError(new Error("New Email and Confirm New Email are not the same."));
            return;
        }

        changeEmail(session, newEmail, password)
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

                <Form.Group controlId="formChangeEmailCurrentPassword">
                    <Form.Label>Current Password *</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter current password"
                        onChange={(event: React.FormEvent<HTMLInputElement>) => setPassword(event.currentTarget.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formChangeEmailNewEmail">
                    <Form.Label>New Email *</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        autoComplete=""
                        placeholder="Enter new Email"
                        onChange={(event: React.FormEvent<HTMLInputElement>) => setNewEmail(event.currentTarget.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formChangeEmailConfirmNewEmail">
                    <Form.Label>Confirm New Email *</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        autoComplete=""
                        placeholder="Confirm new email"
                        onChange={(event: React.FormEvent<HTMLInputElement>) => setConfirmNewEmail(event.currentTarget.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formChangeEmailSubmit">
                    <Button variant="primary" type="submit">Change Email</Button>
                </Form.Group>

            </Form>

        </>
    );

};

export default ChangeEmail;