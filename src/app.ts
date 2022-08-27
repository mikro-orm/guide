import { fastify } from 'fastify';
import fastifyJWT from '@fastify/jwt';
import { NotFoundError, RequestContext } from '@mikro-orm/sqlite';
import { initORM } from './db.js';
import { registerUserRoutes } from './modules/user/routes.js';
import { registerArticleRoutes } from './modules/article/routes.js';
import { AuthError } from './modules/common/utils.js';

export async function bootstrap(port = 3001, migrate = true) {
  const db = await initORM();

  if (migrate) {
    // sync the schema
    await db.orm.migrator.up();
  }

  const app = fastify();

  // register JWT plugin
  app.register(fastifyJWT, {
    secret: process.env.JWT_SECRET ?? '12345678', // fallback for testing
  });

  // register request context hook
  app.addHook('onRequest', (request, reply, done) => {
    RequestContext.create(db.em, done);
  });

  // register auth hook after the ORM one to use the context
  app.addHook('onRequest', async request => {
    try {
      const ret = await request.jwtVerify<{ id: number }>();
      request.user = await db.user.findOneOrFail(ret.id);
    } catch (e) {
      app.log.error(e);
      // ignore token errors, we validate the request.user exists only where needed
    }
  });

  // register global error handler to process 404 errors from `findOneOrFail` calls
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AuthError) {
      return reply.status(401).send({ error: error.message });
    }

    if (error instanceof NotFoundError) {
      return reply.status(404).send({ error: error.message });
    }

    app.log.error(error);
    reply.status(500).send({ error: error.message });
  });

  // shut down the connection when closing the app
  app.addHook('onClose', async () => {
    await db.orm.close();
  });

  app.register(registerUserRoutes, { prefix: 'user' });
  app.register(registerArticleRoutes, { prefix: 'article' });

  const url = await app.listen({ port });

  return { app, url };
}
