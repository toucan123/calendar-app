import dotenv from 'dotenv';
import Fastify from 'fastify';
import { routes as authRoutes } from './routes/auth/auth';
import { swaggerPlugin } from './middlewares/swagger';
import { ErrorCodes } from './utils/errors';

dotenv.config();

const PORT = 3131;

const app = Fastify();

app.register(swaggerPlugin);
app.register(authRoutes, { prefix: 'api' });

app.setErrorHandler((error, request, reply) => {
  console.log(JSON.stringify(error));
  reply.status(ErrorCodes.SERVER_ERROR).send(error.message);
});

async function start() {
  app.ready();
  app.listen({ port: PORT, host: '0.0.0.0' });
  
  console.log(`listening on ${PORT}`);
};

start();
