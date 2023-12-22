import { Amplify, Auth } from 'aws-amplify';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const awsRegion = 'ap-south-1';

Amplify.configure({
    Auth: {
        region: awsRegion,
        userPoolId: 'ap-south-1_o50cwPD5w',
        userPoolClientId: '748u57k52ket4ml91mte1u3cb8',
        authenticationFlowType: 'USER_PASSWORD_AUTH',
        identityPoolId: 'ap-south-1:23a86480-e5bc-4eb7-9f34-592ccad70faf'
    }
});

export class AuthService {

    public async login(username: string, password: string) {
        try {
            const result = await Auth.signIn(username, password);
            return result;
        } catch (error) {
            return {
                error: error,
                message: error.message
            }
        }
    }

    public async generateTemporaryCredentials(user: any) {
        const jwtToken = user.getSignInUserSession().getIdToken().getJwtToken();
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/ap-south-1_o50cwPD5w`;
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                identityPoolId: 'ap-south-1:23a86480-e5bc-4eb7-9f34-592ccad70faf',
                logins: {
                    [cognitoIdentityPool]: jwtToken
                }
            })
        });

        const credentials = await cognitoIdentity.config.credentials();
        return credentials;
    }
}
