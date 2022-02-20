import * as adal from 'adal-node';

export class BCConnector {
    authorityUrl: string;
    resource: string;
    adalContext: adal.AuthenticationContext;
    tokenResponse?: adal.TokenResponse;

    constructor(tenantId: string, resource: string, private clientId: string, private username: string, private password: string) {
        this.authorityUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;
        this.resource = `https://${resource}/`;

        this.adalContext = new adal.AuthenticationContext(this.authorityUrl);
    }

    connect(): Promise<adal.TokenResponse> {
        return new Promise((resolve, reject) => {
            const adalCallback: adal.AcquireTokenCallback = (error: Error, response: adal.TokenResponse | adal.ErrorResponse) => {
                if (!error) {
                    console.log('Authentication successful.');
                    this.tokenResponse = response as adal.TokenResponse;
                    resolve(this.tokenResponse);
                }
                else {
                    console.log('Authentication failed.');
                    reject(error);
                }
            }

            console.log('Authenticating ....');
            if (this.tokenResponse && this.tokenResponse.refreshToken) {
                this.adalContext.acquireTokenWithRefreshToken(this.tokenResponse.refreshToken, this.clientId, this.resource, adalCallback);
            } else {
                this.adalContext.acquireTokenWithUsernamePassword(this.resource, this.username, this.password, this.clientId, adalCallback);
            }
        });
    }
}