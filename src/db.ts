import { MikroORM } from '@mikro-orm/core';
import { User } from './entities/User.js';
import { Comment } from './entities/Comment.js';
import { Article } from './entities/Article.js';

let orm: MikroORM;

export async function initDB() {
  if (!orm) {
    orm = await MikroORM.init();
  }

  return {
    orm,
    em: orm.em,
    db: {
      em: orm.em,
      article: orm.em.getRepository(Article),
      comment: orm.em.getRepository(Comment),
      user: orm.em.getRepository(User),
    },
  }
}
