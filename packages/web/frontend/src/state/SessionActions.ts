export type SessionActions = {
    clearMessages: () => void;
    setError: (error: Error) => void;
    setErrors: (errors: Error[]) => void;
    setWarning: (warning: string) => void;
    setWarnings: (warings: string[]) => void;
    setSuccess: (success: string) => void;
    setSuccesses: (successes: string[]) => void;

    isUserLoggedIn: () => boolean;
    recoverSession: () => Promise<boolean>;
    login: (username: string, password: string, rememberDevice: boolean) => Promise<boolean>;
    logout: () => Promise<void>;

    fetchMfaDevice: () => Promise<string>;
    sendSoftwareToken: (mfaCode: string) => Promise<void>;
    associateSoftwareToken: () => Promise<string>;
    verifySoftwareToken: (verificationCode: string, deviceName: string) => Promise<void>;
    disableMfaDevice: () => Promise<void>;

    changePassword: (password: string, newPassword: string) => Promise<boolean>;

    forgotPasswordCodeRequest: (email: string) => Promise<void>;
    forgotPasswordConfirm: (email: string, code: string, newPassword: string) => Promise<void>;

    signup: (email: string, name: string, password: string) => Promise<void>;
};

export * from './actions/MessageActions';
export * from './actions/ChangePasswordActions';
export * from './actions/ForgetPasswordActions';
export * from './actions/LoginActions';
export * from './actions/LogoutActions';
export * from './actions/MfaActions';
export * from './actions/SignupActions';
