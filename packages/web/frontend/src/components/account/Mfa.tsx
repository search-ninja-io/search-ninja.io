import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Form, Button } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { SessionState } from '../../state/SessionStore';
import { SessionActions } from '../../state/SessionActions';

enum DisplayMode {
    MfaDevice = 1,
    AddMfaDevice = 2,
}

export const Mfa = (props: { sessionStore: [SessionState, SessionActions] } & RouteComponentProps): JSX.Element => {
    const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.MfaDevice);
    const [, sessionActions] = props.sessionStore;
    const [mfaDevice, setMfaDevice] = useState<string>();

    const MfaDevice = (props: {} & RouteComponentProps): JSX.Element => {
        useEffect(() => {
            if (!mfaDevice) {
                sessionActions
                    .fetchMfaDevice()
                    .then((mfaDevice) => setMfaDevice(mfaDevice))
                    .catch((err) => sessionActions.setError(err));
            }
        }, [mfaDevice]);

        const onChangeMfaEnabled = (): void => {
            if (mfaDevice === undefined || mfaDevice.length === 0) {
                setDisplayMode(DisplayMode.AddMfaDevice);
            } else {
                sessionActions
                    .disableMfaDevice()
                    .then(() => sessionActions.setSuccess('Successfully disabled MFA device. Please login again.'))
                    .then(() => props.history.push('/login'))
                    .catch((err) => sessionActions.setError(err));
            }
        };

        if (!mfaDevice) {
            return <p>Loading...</p>;
        }

        return (
            <Form className="mt-3">
                <Form.Group controlId="formLoginSubmit">
                    <Form.Check
                        type="switch"
                        checked={mfaDevice !== undefined && mfaDevice.length > 0}
                        label={
                            mfaDevice !== undefined && mfaDevice.length > 0
                                ? 'Multi Factor Authentication is enabled (Device: ' + mfaDevice + ')'
                                : 'Multi factor Authentication is disabled'
                        }
                        onChange={(): void => onChangeMfaEnabled()}
                    />
                </Form.Group>
            </Form>
        );
    };

    const AddMfaDevice = (props: {} & RouteComponentProps): JSX.Element => {
        const [generatedQRCode, setGeneratedQRCode] = useState<string>();
        const [verificationCode, setVerificationCode] = useState<string>();
        const [deviceName, setDeviceName] = useState<string>();

        console.log('AddMfaDevice');

        useEffect(() => {
            if (!generatedQRCode) {
                sessionActions
                    .associateSoftwareToken()
                    .then((data) => setGeneratedQRCode(data))
                    .catch((err) => sessionActions.setError(err));
            }
        }, [generatedQRCode, sessionActions]);

        const onSubmitVerify = (event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault();
            if (!verificationCode || !deviceName) {
                const error = new Error('Verification Code and/or Device Name are empty.');
                sessionActions.setError(error);
                return;
            }
            sessionActions
                .verifySoftwareToken(verificationCode, deviceName)
                .then(() => sessionActions.setSuccess('Successfully added MFA device. Please login again.'))
                .then(() => props.history.push('/login'))
                .catch((err) => sessionActions.setError(err));
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
                        required
                        type="text"
                        autoComplete="one-time-code"
                        placeholder="Enter Verification Code"
                        onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                            setVerificationCode(event.currentTarget.value)
                        }
                    />
                </Form.Group>

                <Form.Group controlId="formTOTPDeviceName">
                    <Form.Label>Device Name *</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Enter Device Name"
                        onChange={(event: React.FormEvent<HTMLInputElement>): void =>
                            setDeviceName(event.currentTarget.value)
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

    if (displayMode === DisplayMode.AddMfaDevice) {
        return <AddMfaDevice {...props} />;
    }
    return <MfaDevice {...props} />;
};

export default Mfa;
