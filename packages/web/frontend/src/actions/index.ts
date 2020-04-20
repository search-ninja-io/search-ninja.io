import { ChangePasswordActions } from './ChangePasswordActions';
import { ForgetPasswordActions } from './ForgetPasswordActions';
import { LoginActions } from './LoginActions';
import { LogoutActions } from './LogoutActions';
import { MessageActions } from './MessageActions';
import { MfaActions } from './MfaActions';
import { SignupActions } from './SignupActions';

export type Actions = ChangePasswordActions &
    ForgetPasswordActions &
    LoginActions &
    LogoutActions &
    MessageActions &
    MfaActions &
    SignupActions;

export * from './ChangePasswordActions';
export * from './ForgetPasswordActions';
export * from './LoginActions';
export * from './LogoutActions';
export * from './MessageActions';
export * from './MfaActions';
export * from './SignupActions';
