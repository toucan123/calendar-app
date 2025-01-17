
import { OAuth2Client, Credentials, TokenInfo, OAuth2ClientOptions } from 'google-auth-library';

export const clientConfig: OAuth2ClientOptions = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.SELF}/auth/callback`,
};

export class AuthConnector {
  private authClient: OAuth2Client;
  
  constructor() {
    this.authClient = new OAuth2Client(clientConfig);
  }

  async exchangeCodeForTokens(code: string): Promise<Credentials> {
    const { tokens } = await this.authClient.getToken(code);
    return tokens;
  }

  async validateAccessToken(accessToken: string): Promise<TokenInfo> {
    return this.authClient.getTokenInfo(accessToken);
  }
}

