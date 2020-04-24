import { ChangePasswordActions } from './ChangePassword';
import { ForgetPasswordActions } from './ForgetPassword';
import { SignInActions } from './SignIn';
import { SignOutActions } from './SignOut';
import { MessageActions } from './Message';
import { TotpActions } from './Totp';
import { SignUpActions } from './SignUp';

export type Actions = ChangePasswordActions &
    ForgetPasswordActions &
    SignInActions &
    SignOutActions &
    MessageActions &
    TotpActions &
    SignUpActions;

export * from './Actions';
