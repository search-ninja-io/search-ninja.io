import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { MessageBannerProps } from '../banner/MessageBanner';
import { useSessionStore } from '../../state/SessionStore';

interface MfaProps {
    setMessage: React.Dispatch<React.SetStateAction<MessageBannerProps>>;
}

enum DisplayMode {
    MfaDevice = 1,
    AddMfaDevice = 2,
    Logout = 3,
}

export const Mfa = (props: MfaProps): JSX.Element => {
    const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.MfaDevice);
    const [, sessionActions] = useSessionStore();

    if (!sessionActions.isUserLoggedIn()) {
        return <Redirect to="/login" />;
    }

    const handleMfaDevice = (err?: Error): void => {
        if (err) props.setMessage({ errors: [err] });
        else {
            props.setMessage({});
            setDisplayMode(DisplayMode.AddMfaDevice);
        }
    };

    if (displayMode === DisplayMode.MfaDevice) {
        return <MfaDevice callback={handleMfaDevice} />;
    }

    const handleAddMfaDevice = (err?: Error): void => {
        if (err) props.setMessage({ errors: [err] });
        else {
            props.setMessage({});
            setDisplayMode(DisplayMode.Logout);
        }
    };

    if (displayMode === DisplayMode.AddMfaDevice) {
        return <AddMfaDevice callback={handleAddMfaDevice} />;
    }

    if (displayMode === DisplayMode.Logout) {
        return <Redirect to="/logout" />;
    }

    return <p>Unknow Display Mode: {displayMode}</p>;
};

interface MfaDeviceProps {
    callback: (err?: Error, result?: string) => void;
}

const MfaDevice = (props: MfaDeviceProps): JSX.Element => {
    const [mfaDevice, setMfaDevice] = useState<string>();

    const [, sessionActions] = useSessionStore();

    useEffect(() => {
        if (!mfaDevice) {
            sessionActions
                .fetchMfaDevice()
                .then((mfaDevice) => setMfaDevice(mfaDevice))
                .catch((err) => props.callback(err, undefined));
        }
    }, [props, mfaDevice, sessionActions]);

    const onChangeMfaEnabled = (): void => {
        if (mfaDevice === undefined || mfaDevice.length === 0) {
            props.callback(undefined, 'SUCCESS');
        } else {
            sessionActions
                .disableMfaDevice()
                .then(() => setMfaDevice(undefined))
                .catch((err) => props.callback(err, undefined));
        }
    };

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

interface AddMfaDeviceProps {
    callback: (err?: Error, result?: string) => void;
}

const AddMfaDevice = (props: AddMfaDeviceProps): JSX.Element => {
    const [generatedQRCode, setGeneratedQRCode] = useState<string>();
    const [verificationCode, setVerificationCode] = useState<string>();
    const [deviceName, setDeviceName] = useState<string>();

    const [, sessionActions] = useSessionStore();

    useEffect(() => {
        if (!generatedQRCode) {
            sessionActions
                .associateSoftwareToken()
                .then((data) => setGeneratedQRCode(data))
                .catch((err) => props.callback(err, undefined));
        }
    }, [props, generatedQRCode, sessionActions]);

    const onSubmitVerify = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (!verificationCode || !deviceName) {
            props.callback(
                new Error('Verification Code and/or Device Name are empty. Please fill in the required values.'),
            );
            return;
        }
        sessionActions
            .verifySoftwareToken(verificationCode, deviceName)
            .then(() => props.callback(undefined, 'SUCCESS'))
            .catch((err) => props.callback(err, undefined));
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

export default Mfa;
