import { afterAll, beforeAll, expect, test } from 'vitest';
import { initORM, type Services } from '../src/db.js';
import config from '../src/mikro-orm.config.js';
import { TestSeeder } from '../src/seeders/TestSeeder.js';
import { CommentSchema } from '../src/modules/article/comment.entity.js';
import { ArticleSchema } from '../src/modules/article/article.entity.js';
import { UserSchema } from '../src/modules/user/user.entity.js';

let db: Services;

beforeAll(async () => {
  db = initORM({
    ...config,
    debug: false,
    dbName: ':memory:',
  });

  await db.orm.schema.create();
  await db.orm.seeder.seed(TestSeeder);
});

afterAll(async () => {
  await db.orm.close(true);
});

test('soft delete excludes comment from queries', async () => {
  const em = db.em.fork();

  // find a comment to delete
  const comments = await em.findAll(CommentSchema);
  const totalBefore = comments.length;
  expect(totalBefore).toBeGreaterThan(0);
  const comment = comments[0];
  const commentId = comment.id;

  // remove it - the soft delete subscriber should intercept this
  em.remove(comment);
  await em.flush();

  // the comment should not be found with default filters (softDelete is enabled by default)
  const found = await em.fork().findOne(CommentSchema, commentId);
  expect(found).toBeNull();

  // total count should be reduced by one
  const totalAfter = await em.fork().count(CommentSchema);
  expect(totalAfter).toBe(totalBefore - 1);

  // but it should still exist in the database with deletedAt set
  const withDeleted = await em.fork().findOneOrFail(CommentSchema, commentId, {
    filters: { softDelete: false },
  });
  expect(withDeleted.deletedAt).toBeInstanceOf(Date);
});

test('soft delete does not affect entities without deletedAt', async () => {
  const em = db.em.fork();

  // create a standalone article with no comments
  const [user] = await em.findAll(UserSchema, { limit: 1 });
  const article = em.create(ArticleSchema, {
    title: 'To be deleted',
    description: 'This article will be physically deleted',
    text: 'content',
    author: user,
  });
  await em.flush();
  const articleId = article.id;

  // now delete it - Article has no `deletedAt`, so it should be physically removed
  em.remove(article);
  await em.flush();

  // article should be physically gone
  const found = await em.fork().findOne(ArticleSchema, articleId);
  expect(found).toBeNull();
});
