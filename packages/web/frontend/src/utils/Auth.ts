import { CognitoUser, AuthenticationDetails, CognitoUserAttribute, ICognitoUserAttributeData, CognitoUserPool, ISignUpResult } from "amazon-cognito-identity-js";

import { config } from "./Config";

const cognitoUserPool = new CognitoUserPool({
    UserPoolId: config.Cognito.UserPoolId,
    ClientId: config.Cognito.ClientId
});

export interface Session {
    user: CognitoUser;
    cognitoSession: any;
    userAttributes: UserAttributes;
}

export interface UserAttributes {
    [name: string]: string;
}

export const getSession = async () => {
    return await new Promise<Session>((resolve, reject) => {

        const user = cognitoUserPool.getCurrentUser();

        if (!user) {
            reject("No user session found");
            return;
        }

        user.getSession(async (err: any, session: any) => {
            if (err) {
                reject(err);
                return;
            }

            const attributes = await new Promise<UserAttributes>((resolve, reject) => {
                user.getUserAttributes((err?: Error, attributes?: CognitoUserAttribute[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const results: UserAttributes = {};
                    (attributes || []).forEach(attr => (results[attr.getName()] = attr.getValue()));

                    resolve(results);
                });
            });

            resolve({
                user: user,
                cognitoSession: session,
                userAttributes: attributes
            });
        });
    });
};

export const login = async (username: string, password: string) => {
    return await new Promise<Session>((resolve, reject) => {
        const user = new CognitoUser({ Username: username, Pool: cognitoUserPool });
        const authDetails = new AuthenticationDetails({ Username: username, Password: password });

        user.authenticateUser(authDetails, {
            onFailure: err => reject(err),
            onSuccess: async () => await getSession()
                .then(session => resolve(session))
                .catch(err => reject(err))
        });
    });
};

export const logout = async () => {
    return await new Promise<void>((resolve, reject) => {
        const user = cognitoUserPool.getCurrentUser();
        if (user) {
            user.signOut();
        }
        resolve();
    });
};

export const signup = async (email: string, name: string, password: string) => {
    return await new Promise<ISignUpResult>((resolve, reject) => {
        const userAttributes = [
            new CognitoUserAttribute({
                Name: "name",
                Value: name
            })
        ];
        cognitoUserPool.signUp(email, password, userAttributes, [], (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });

    });
};

export const forgotPasswordCodeRequest = async (email: string) => {
    return await new Promise<void>((resolve, reject) => {
        const user = new CognitoUser({ Username: email, Pool: cognitoUserPool });
        user.forgotPassword({
            onSuccess: () => resolve(),
            onFailure: err => reject(err)
        });
    });
};

export const forgotPasswordConfirm = async (email: string, code: string, newPassword: string) => {
    return await new Promise<void>((resolve, reject) => {
        const user = new CognitoUser({ Username: email, Pool: cognitoUserPool });
        user.confirmPassword(code, newPassword, {
            onSuccess: () => resolve(),
            onFailure: err => reject(err)
        });
    });
};

export const changeEmail = async (session: Session, newEmail: string, password: string) => {
    return await new Promise<void>((resolve, reject) => {
        const { user } = session;
        const data: ICognitoUserAttributeData[] = [{ Name: "email", Value: newEmail }];
        user.updateAttributes(data, (err?: Error, result?: string) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

export const changePassword = async (session: Session, password: string, newPassword: string) => {
    return await new Promise<void>((resolve, reject) => {
        const { user } = session;
        user.changePassword(password, newPassword, (err?: Error, result?: string) => {
            if (err) reject(err);
            else resolve();
        });
    });
};