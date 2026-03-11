import { MikroORM, type Options, EntityManager, EntityRepository } from '@mikro-orm/sqlite';
import { type User, UserSchema } from './modules/user/user.entity.js';
import { ArticleSchema, type IArticle } from './modules/article/article.entity.js';
import { CommentSchema, type IComment } from './modules/article/comment.entity.js';
import { TagSchema, type ITag } from './modules/article/tag.entity.js';
import { UserRepository } from './modules/user/user.repository.js';
import { ArticleRepository } from './modules/article/article.repository.js';
import config from './mikro-orm.config.js';

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  user: UserRepository;
  article: ArticleRepository;
  comment: EntityRepository<IComment>;
  tag: EntityRepository<ITag>;
}

let cache: Services;

export function initORM(options?: Partial<Options>): Services {
  if (cache) {
    return cache;
  }

  const orm = new MikroORM({
    ...config,
    ...options,
  });

  // save to cache before returning
  return cache = {
    orm,
    em: orm.em,
    user: orm.em.getRepository(UserSchema),
    article: orm.em.getRepository(ArticleSchema),
    comment: orm.em.getRepository(CommentSchema),
    tag: orm.em.getRepository(TagSchema),
  };
}
