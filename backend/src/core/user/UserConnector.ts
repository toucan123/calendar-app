
import { OAuth2Client } from 'google-auth-library';
import { google, oauth2_v2 } from 'googleapis';
import { clientConfig } from '../auth/AuthConnector';

export class UserConnector {
  private oauth2: oauth2_v2.Oauth2;
  
  constructor(params: { accessToken: string }) {
    const authClient = new OAuth2Client(clientConfig);
    authClient.setCredentials({ access_token: params.accessToken });
    
    this.oauth2 = google.oauth2({ version: 'v2', auth: authClient });
  }

  async getUserInfo() : Promise<oauth2_v2.Schema$Userinfo | undefined> {
    try {
      const { data } = await this.oauth2.userinfo.get();
      return data;
    } catch(error) {
      console.log('what the fuck', error);
    }
    
  }
}

