import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../entities/User.js';

export class TestSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    em.create(User, {
      email: 'foo@bar.com',
      username: 'foobar',
      password: 'password123',
      articles: [
        { title: 'title 1/3' },
        { title: 'title 2/3' },
        { title: 'title 3/3' },
      ],
    });
  }

}
