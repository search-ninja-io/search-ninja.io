import { Session } from './Session';

export const saveDeviceStatus = async (session: Session, rememberDevice: boolean): Promise<Session> => {
    return await new Promise<Session>((resolve, reject) => {
        console.log('Session', session, session.cognitoSession, session.user, session.userAttributes);

        const rememberDeviceHandler = {
            onSuccess: (): void => resolve(session),
            onFailure: (err: unknown): void => reject(err),
        };
        if (rememberDevice) {
            session.user.setDeviceStatusRemembered(rememberDeviceHandler);
        } else {
            session.user.setDeviceStatusNotRemembered(rememberDeviceHandler);
        }
    });
};
