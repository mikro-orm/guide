import { fastify } from 'fastify'
import cors from '@fastify/cors'
import { NotFoundError, RequestContext } from '@mikro-orm/sqlite'
import { initORM } from './db.js'
import { AuthError } from './modules/common/utils.js'
import { registerCategoryRoutes } from "./modules/category/category.routes.js"
import { registerPersonRoutes } from "./modules/person/person.routes.js"

//https://github.com/covidgreen/covid-green-backend-api; good shit
export async function bootstrap(port = 3001, migrate = true) {
  const db = await initORM()

  if (migrate) {
    // sync the schema
    await db.orm.migrator.up()
  }

  const app = fastify({
    logger: true
  })

  app.register(cors, {
    origin: (origin, cb) => {
      const hostname = new URL(origin!).hostname
      if(hostname === "localhost"){
        //  Request from localhost will pass
        cb(null, true)
        return
      }

      // Generate an error on other origins, disabling access
      cb(new Error("Not allowed"), false)
    }
  })

  // register request context hook
  app.addHook('onRequest', (request, reply, done) => {
    RequestContext.create(db.em, done);
  })

  // app.addHook('preHandler', (request, reply, done) => {
  //   const allowedPaths: string[] = ['/category', '/person']
  //   if (allowedPaths.includes(request.routerPath)) {
  //     reply.header("Access-Control-Allow-Origin", "*")
  //     reply.header("Access-Control-Allow-Methods", "POST")
  //     reply.header("Access-Control-Allow-Headers",  "*")
  //   }
  //
  //   done()
  // })

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

  app.register(registerCategoryRoutes, { prefix: 'category' })
  app.register(registerPersonRoutes, { prefix: 'person' })

  const url = await app.listen({ port })

  return { app, url }
}
