import * as AWS from 'aws-sdk';
import { config } from '../utils/Config';
import { Session } from './Session';

export const saveIdentityPoolCredentials = async (session: Session): Promise<Session> => {
    return await new Promise<Session>((resolve, reject) => {
        const { Region, UserPoolId, IdentityPoolId } = config.Cognito;
        AWS.config.region = Region;
        const cognitoIdp = 'cognito-idp.' + Region + '.amazonaws.com/' + UserPoolId;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: IdentityPoolId,
            Logins: {
                [cognitoIdp]: session.cognitoSession.getIdToken().getJwtToken(),
            },
        });
        (AWS.config.credentials as AWS.CognitoIdentityCredentials).refresh((err) =>
            err ? reject(err) : resolve(session),
        );
    });
};
