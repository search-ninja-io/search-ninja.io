export type SessionActions = {
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

export * from './ChangePasswordActions';
export * from './ForgetPasswordActions';
export * from './LoginActions';
export * from './LogoutActions';
export * from './MfaActions';
export * from './SignupActions';
