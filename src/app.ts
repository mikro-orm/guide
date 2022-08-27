import { fastify } from 'fastify';
import { NotFoundError, RequestContext } from '@mikro-orm/core';
import { initDB } from './db.js';
import { registerUserRoutes } from './routes/user.js';

export async function bootstrap(port = 3001) {
  const app = fastify();
  const { orm, em } = await initDB();

  app.addHook('onRequest', (req, reply, done) => {
    RequestContext.create(em, done);
  })

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof NotFoundError) {
      return reply.status(404).send({ error: error.message });
    }

    console.error(error);
    reply.status(500).send({ error: error.message })
  });

  app.addHook('onClose', async () => {
    await orm.close();
  });

  await registerUserRoutes(app);

  const url = await app.listen({ port });

  return { app, url };
}
