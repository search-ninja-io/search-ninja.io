import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Form, Button } from 'react-bootstrap';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { State } from '../../state';
import { Actions } from '../../actions';

enum DisplayMode {
    TotpDevice = 1,
    AddTotpDevice = 2,
}

export const Totp = (props: { store: [State, Actions] } & RouteComponentProps): JSX.Element => {
    const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.TotpDevice);

    const [{ currentUserDetails }, actions] = props.store;
    if (!currentUserDetails) {
        actions.setError('User is not logged in.');
        return <Redirect to="/login" />;
    }

    const { isTotpEnabled } = currentUserDetails;

    const TotpDevice = (): JSX.Element => {
        const onChangeTotpEnabled = (): void => {
            if (!isTotpEnabled) {
                setDisplayMode(DisplayMode.AddTotpDevice);
                return;
            }

            actions
                .disableTotp()
                .then(() => actions.setSuccess('Successfully disabled MFA device.'))
                .catch((err) => actions.setError(err));
        };

        return (
            <Form className="mt-3">
                <Form.Group controlId="formLoginSubmit">
                    <Form.Check
                        type="switch"
                        checked={isTotpEnabled}
                        label={'Multi Factor Authentication is ' + (isTotpEnabled ? 'enabled' : 'disabled')}
                        onChange={(): void => onChangeTotpEnabled()}
                    />
                </Form.Group>
            </Form>
        );
    };

    const AddTotpDevice = (): JSX.Element => {
        const [generatedQRCode, setGeneratedQRCode] = useState<string>();
        const [verificationCode, setVerificationCode] = useState<string>();

        useEffect(() => {
            if (!generatedQRCode) {
                actions
                    .setupTotp()
                    .then((data) => setGeneratedQRCode(data))
                    .catch((err) => actions.setError(err));
            }
        }, [generatedQRCode]);

        const onSubmitVerify = (event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault();

            if (!verificationCode) {
                actions.setError('Verification Code is empty.');
                return;
            }

            actions
                .verifyTotpToken(verificationCode)
                .then(() => actions.setSuccess('Successfully added MFA device. Please login again.'))
                .catch((err) => actions.setError(err));
        };

        if (!generatedQRCode) {
            return <p>Token generation in progress...</p>;
        }

        return (
            <Form onSubmit={onSubmitVerify}>
                <Form.Group controlId="formTOTPCode">
                    <Form.Label>QR Code</Form.Label>
                    <br />
                    <QRCode includeMargin={true} value={generatedQRCode} />
                </Form.Group>

                <Form.Group controlId="formTOTPVerificationCode">
                    <Form.Label>Verification Code *</Form.Label>
                    <Form.Control
                        autoFocus
                        required
                        type="text"
                        autoComplete="one-time-code"
                        placeholder="Enter Verification Code"
                        onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                            setVerificationCode(event.currentTarget.value)
                        }
                    />
                </Form.Group>

                <Form.Group controlId="formLoginSubmit">
                    <Button variant="primary" type="submit">
                        Verify
                    </Button>
                </Form.Group>
            </Form>
        );
    };

    if (displayMode === DisplayMode.AddTotpDevice) {
        return <AddTotpDevice />;
    }
    return <TotpDevice />;
};

export default Totp;
