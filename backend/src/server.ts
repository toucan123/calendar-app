import './dotenv';
import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import { swaggerPlugin } from './middlewares/swagger';
import { ErrorCodes } from './utils/errors';
import { routes as authRoutes } from './routes/auth/auth';
import { routes as userRoutes } from './routes/user/user';

const PORT = 3131;

const app = Fastify();

app.register(fastifyCookie);
app.register(swaggerPlugin);

app.register(fastifyCors, {
  origin: process.env.FRONT_END_LOCATION,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

app.register(authRoutes);
app.register(userRoutes);

app.setErrorHandler((error, request, reply) => {
  console.log('Default Error Handler', JSON.stringify(error));
  reply.status(ErrorCodes.SERVER_ERROR).send(error.message);
});

async function start() {
  app.ready();
  app.listen({ port: PORT, host: '0.0.0.0' });
  
  console.log(`listening on ${PORT}`);
};

start();
