import { fastify } from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import path from 'path'
import { fileURLToPath } from 'url'
import { NotFoundError, RequestContext } from '@mikro-orm/sqlite'
import { initORM } from './db.js'
import { AuthError } from './modules/common/utils.js'
import { registerCategoryRoutes } from "./modules/category/category.routes.js"
import { registerPersonRoutes } from "./modules/person/person.routes.js"
import * as process from "node:process"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//https://github.com/covidgreen/covid-green-backend-api; good shit
export async function bootstrap(port = 3001, migrate = true) {
  const db = await initORM()

  if (migrate) {
    // sync the schema
    await db.orm.migrator.up()
  }

  const app = fastify({
    logger: {
      level: "info",
    }
  })

  app.register(cors, {
    origin: true
  })

  app.register(fastifyStatic, {
    root: path.join(__dirname, '../src/public'),
    prefix: '/'
  })

  // register request context hook
  app.addHook('onRequest', (request, reply, done) => {
    RequestContext.create(db.em, done);
  })

  // register global error handler to process 404 errors from `findOneOrFail` calls
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AuthError) {
      return reply.status(401).send({ error: error.message })
    }

    if (error instanceof NotFoundError) {
      return reply.status(404).send({ error: error.message })
    }

    app.log.error(error)
    reply.status(500).send({ error: error.message })
  })

  // shut down the connection when closing the app
  app.addHook('onClose', async () => {
    await db.orm.close()
  })

  //todo add /api prefix as well
  app.register(registerCategoryRoutes, { prefix: 'category' })
  app.register(registerPersonRoutes, { prefix: 'person' })

  let url
  if (process.env.NODE_ENV === 'development') {
    url = await app.listen({ port, host: '127.0.0.1' })
  } else {
    url = await app.listen({ port, host: '0.0.0.0' })
  }

  return { app, url }
}
