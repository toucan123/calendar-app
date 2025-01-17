import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { AuthConnector } from '../core/auth/AuthConnector';

const authConnector = new AuthConnector();

export const authPlugin = fastifyPlugin(async (fastifyInstance: FastifyInstance) => {
  await fastifyInstance.addHook('onRequest', async (req, res) => {    
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).send({ error: 'Access token not found' });
    }

    try {
      const tokenInfo = await authConnector.validateAccessToken(accessToken);
      console.log('okay we got data', tokenInfo);
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).send({ error: 'Invalid or expired token' });
    }
  });
});