import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import { UserConnector } from '../../core/user/UserConnector';
import { authPlugin } from '../../middlewares/auth';

export const routes = async (fastifyInstance: FastifyInstance) => {
  fastifyInstance.register(authPlugin)
  const router = fastifyInstance
    .withTypeProvider<TypeBoxTypeProvider>()
    .setValidatorCompiler(TypeBoxValidatorCompiler)

  router.get('/user/info', async (req, res) => {
    const accessToken = req.cookies.accessToken as string;
    const userConnector = new UserConnector({ accessToken });
    
    try {
      const userInfo = await userConnector.getUserInfo();
      console.log('info:', userInfo);
      
      res.status(200).send(userInfo);
    } catch (error) {
      console.log(accessToken, 'oh no');
      res.status(500).send({ error });
    }
  });
}