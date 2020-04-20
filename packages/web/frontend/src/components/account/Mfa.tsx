import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Form, Button } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { State } from '../../store';
import { Actions } from '../../actions';

enum DisplayMode {
    MfaDevice = 1,
    AddMfaDevice = 2,
}

export const Mfa = (props: { sessionStore: [State, Actions] } & RouteComponentProps): JSX.Element => {
    const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.MfaDevice);
    const [, actions] = props.sessionStore;
    const [mfaDevice, setMfaDevice] = useState<string>();

    const MfaDevice = (props: {} & RouteComponentProps): JSX.Element => {
        useEffect(() => {
            if (!mfaDevice) {
                actions
                    .fetchMfaDevice()
                    .then((mfaDevice) => setMfaDevice(mfaDevice))
                    .catch((err) => actions.setError(err));
            }
        }, [mfaDevice]);

        const onChangeMfaEnabled = (): void => {
            if (mfaDevice === undefined || mfaDevice.length === 0) {
                setDisplayMode(DisplayMode.AddMfaDevice);
            } else {
                actions
                    .disableMfaDevice()
                    .then(() => actions.setSuccess('Successfully disabled MFA device. Please login again.'))
                    .then(() => props.history.push('/login'))
                    .catch((err) => actions.setError(err));
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
                actions
                    .associateSoftwareToken()
                    .then((data) => setGeneratedQRCode(data))
                    .catch((err) => actions.setError(err));
            }
        }, [generatedQRCode, actions]);

        const onSubmitVerify = (event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault();
            if (!verificationCode || !deviceName) {
                const error = new Error('Verification Code and/or Device Name are empty.');
                actions.setError(error);
                return;
            }
            actions
                .verifySoftwareToken(verificationCode, deviceName)
                .then(() => actions.setSuccess('Successfully added MFA device. Please login again.'))
                .then(() => props.history.push('/login'))
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
