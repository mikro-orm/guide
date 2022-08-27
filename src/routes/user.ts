import { FastifyInstance } from 'fastify';
import { wrap } from "@mikro-orm/core";
import { initDB } from '../db.js';
import { User } from '../entities/User.js';

export async function registerUserRoutes(app: FastifyInstance) {
  const { db } = await initDB();

  app.get('/user', async function (req) {
    return await db.user.findOneOrFail({ email: (req.query as any).email });
  });

  app.post('/user', async function (req) {
    const body = req.body as { username: string; email: string; password: string };
    const u = new User(body.username, body.email, body.password);
    await db.em.persist(u).flush();
    return u;
  });

  app.patch('/user/:id', async function (req) {
    const u = await db.user.findOneOrFail((req.params as any).id);
    wrap(u).assign(req.body as User);
    await db.em.flush();
    return u;
  });

  app.delete('/user/:id', async function (req) {
    const u = await db.user.findOneOrFail((req.params as any).id);
    await db.em.remove(u).flush();

    return { success: true };
  });
}
