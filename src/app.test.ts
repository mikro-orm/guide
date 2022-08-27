import { test } from 'node:test';
import { equal } from 'node:assert';
import { bootstrap } from './app.js';
import { initDB } from './db.js';
import { TestSeeder } from './seeders/TestSeeder.js';

test('get /user', async () => {
  const { app } = await bootstrap();
  const { orm, em } = await initDB();
  orm.config.set('dbName', ':memory:');
  await em.getDriver().reconnect();
  await orm.getSchemaGenerator().createSchema();
  await orm.getSeeder().seed(TestSeeder);
  // TODO run default seeder not working? or generate default seeder without name not working
  // TODO never override existing seeder without --force!

  const res1 = await app.inject({
    method: 'get',
    url: '/user?email=foo@bar.com',
  });

  console.log(res1.body);

  equal(res1.statusCode, 200, 'returns a status code of 200')

  const res2 = await app.inject({
    method: 'get',
    url: '/user?email=foo123@bar.com',
  });

  console.log(res2.body);

  equal(res2.statusCode, 404, 'returns a status code of 404')

  await app.close();
});
