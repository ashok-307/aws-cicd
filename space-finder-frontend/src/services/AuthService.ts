import { Amplify, Auth } from 'aws-amplify';
import { AuthStack } from '../../../space-finder/outputs.json';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const awsRegion = 'eu-west-1';

Amplify.configure({
    Auth: {
        mandatorySignIn: false,
        region: awsRegion,
        userPoolId: AuthStack.SpaceUserPoolID,
        userPoolWebClientId: AuthStack.SpaceUserPoolClientID,
        identityPoolId: AuthStack.SpaceIdentityPoolID,
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
});

export class AuthService {

    private user: any;
    public jwtToken: string | undefined;
    private temporaryCredentials: object | undefined;

    public isAuthorized(){
        if (this.user) {
            return true;
        }
        return false;
    }

    public async login(userName: string, password: string): Promise<Object | undefined> {
        try {
            this.user = await Auth.signIn(userName, password);
            this.jwtToken = this.user?.getSignInUserSession()?.getIdToken().getJwtToken();
            return this.user;
        } catch (error) {
            console.error(error);
            return undefined
        }
    }

    public async getTemporaryCredentials(){
        if (this.temporaryCredentials) {
            return this.temporaryCredentials;
        }
        this.temporaryCredentials = await this.generateTemporaryCredentials();
        return this.temporaryCredentials;
    }

    public getUserName(){
        return this.user?.getUsername();
    }

    private async generateTemporaryCredentials() {
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${AuthStack.SpaceUserPoolID}`;
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                clientConfig: {
                    region: awsRegion
                },
                identityPoolId: AuthStack.SpaceIdentityPoolID,
                logins: {
                    [cognitoIdentityPool]: this.jwtToken!
                }
            })
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials;
    }
}