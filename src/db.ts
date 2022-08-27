import { MikroORM, Options, EntityManager, EntityRepository } from '@mikro-orm/sqlite';
import { User } from './modules/user/user.entity.js';
import { Comment } from './modules/article/comment.entity.js';
import { Article } from './modules/article/article.entity.js';
import { Tag } from './modules/article/tag.entity.js';
import { UserRepository } from './modules/user/user.repository.js';
import { ArticleRepository } from './modules/article/article.repository.js';
import config from './mikro-orm.config.js';

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  comment: EntityRepository<Comment>;
  tag: EntityRepository<Tag>;
  user: UserRepository;
  article: ArticleRepository;
}

let cache: Services;

export async function initORM(options?: Options): Promise<Services> {
  if (cache) {
    return cache;
  }

  // allow overriding config options for testing
  const orm = await MikroORM.init({
    ...config,
    ...options,
  });

  // save to cache before returning
  return cache = {
    orm,
    em: orm.em,
    article: orm.em.getRepository(Article),
    comment: orm.em.getRepository(Comment),
    user: orm.em.getRepository(User),
    tag: orm.em.getRepository(Tag),
  };
}
