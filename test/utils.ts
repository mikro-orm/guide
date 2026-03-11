import { bootstrap } from '../src/app.js';
import { initORM } from '../src/db.js';
import config from '../src/mikro-orm.config.js';
import { TestSeeder } from '../src/seeders/TestSeeder.js';

export async function initTestApp(port: number) {
  // this will create all the ORM services and cache them
  const { orm } = initORM({
    ...config,
    // no need for debug information, it would only pollute the logs
    debug: false,
    // we will use in-memory database, this way we can easily parallelize our tests
    dbName: ':memory:',
  });

  // create the schema so we can use the database
  await orm.schema.create();
  await orm.seeder.seed(TestSeeder);

  const { app } = await bootstrap(port, false);

  return app;
}
