import { FastifyInstance } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import { OAuth2Client } from 'google-auth-library';

const COOKIE_LIFETIME = 30 * 24 * 60 * 60 * 1000; // 30 days

type Auth = {
  credential: string,
};

export const routes = async (fastifyInstance: FastifyInstance) => {
  const router = fastifyInstance
    .withTypeProvider<TypeBoxTypeProvider>()
    .setValidatorCompiler(TypeBoxValidatorCompiler)
    .register(fastifyCookie);

  router.post('/auth/google', async (req, res) => { 
    const client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
    
    const { credential } = req.body as Auth;

    if (!credential) {
      return res.status(400).send({ message: 'Credential is required' });
    }

    try {
      // Verify the ID token with Google
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const userId = payload?.sub;
      const email = payload?.email;

      console.log(`yay doing the work for ${email} ${process.env.GOOGLE_CLIENT_ID}`);

      if (!userId || !email) {
        return res.status(401).send({ message: 'Invalid token payload' });
      }

      // Exchange the ID token for access and refresh tokens
      const { tokens } = await client.getToken({
        code: credential,
      });

      console.log(`yay doing the work for ${tokens} 2`);

      const accessToken = tokens.access_token;
      const refreshToken = tokens.refresh_token;

      if (!accessToken || !refreshToken) {
        return res.status(500).send({ message: 'Failed to get tokens from Google' });
      }

      // Set the refresh token in a secure, HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: COOKIE_LIFETIME
      });

      console.log(`yay doing the work for ${email}`);

      // Send the access token to the frontend    (but why does it need this.  )
      res.send({ accessToken });
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).send({ message: 'Invalid token or token verification failed' });
    }
  });

  // Endpoint to refresh the access token using the refresh token from the cookie
  router.post('/auth/google/refresh', async (req, res) => {
    const { refreshToken } = req.cookies;
    
    const client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOLGE_CLIENT_SECRET,
    });
    client.setCredentials({
      refresh_token: refreshToken,
    });

    if (!refreshToken) {
      return res.status(400).send({ message: 'Refresh token is required' });
    }

    try {
      // Use the refresh token to get a new access token
      const { credentials } = await client.refreshAccessToken();

      const newAccessToken = credentials.access_token;

      if (!newAccessToken) {
        return res.status(500).send({ message: 'Failed to refresh access token' });
      }
      
      console.log(`yay refreshing`);

      res.send({ accessToken: newAccessToken });
    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(401).send({ message: 'Invalid or expired refresh token' });
    }
  });
}