import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import { oauth2_v2 } from 'googleapis';
import { AuthConnector } from '../../core/auth/AuthConnector';
import { UserConnector } from '../../core/user/UserConnector';

const authConnector = new AuthConnector();

type TokenValidationResult = {
  valid: boolean,
  user?: oauth2_v2.Schema$Userinfo
};

export const routes = async (fastifyInstance: FastifyInstance) => {
  const router = fastifyInstance
    .withTypeProvider<TypeBoxTypeProvider>()
    .setValidatorCompiler(TypeBoxValidatorCompiler)

  router.get('/auth/callback', async (req: any, res) => { // FIXME (types, name?)
    const code = req.query.code;

    try {
      const tokens = await authConnector.exchangeCodeForTokens(code);

      if (!tokens.access_token || !tokens.refresh_token) {
        res.status(401).send({ error: 'Auth Failed.' });
      } else {
        console.log('setting', tokens);
        res.cookie('accessToken', tokens.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 3600,
        })
          .redirect(`${process.env.FRONT_END_LOCATION}`);
      }
    } catch (error) {
      res.status(401).send({ error });
    }
  });

  router.post('/auth/logout', async (req, res) => {
    res
      .clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
      .send({ message: 'Logged out' });
  });

  router.post('/auth/validate-access-token', async (req: any, res) => { // FIXME
    const accessToken = req.cookies.accessToken;
    const result: TokenValidationResult = {
      valid: false,
    };
    
    if (accessToken) {
      try {
        const tokenInfo = await authConnector.validateAccessToken(accessToken);
        
        if (tokenInfo) {
          result.valid = true;
          const userConnector = new UserConnector({ accessToken });
          result.user = await userConnector.getUserInfo();
        }

      } catch (error) {
        console.error('Error verifying token:', error);
      }
    }
    
    res.status(200).send(result);
  });
}