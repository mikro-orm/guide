import { FastifyInstance } from 'fastify';
import { wrap } from '@mikro-orm/sqlite';
import { initORM } from '../../db.js';
import { Article } from './article.entity.js';
import { getUserFromToken, verifyArticlePermissions } from '../common/utils.js';

export async function registerArticleRoutes(app: FastifyInstance) {
  const db = await initORM();

  // list articles
  app.get('/', async request => {
    const { limit, offset } = request.query as { limit?: number; offset?: number };

    // start with simple findAndCount
    const { items, total } = await db.article.listArticles({
      limit, offset, cache: 5_000,
    });

    return { items, total };
  });

  // article detail
  app.get('/:slug', async request => {
    const { slug } = request.params as { slug: string };
    return db.article.findOneOrFail({ slug }, {
      populate: ['author', 'comments.author', 'text'],
    });
  });

  // create article
  app.post('/:slug/comment', async request => {
    const { slug, text } = request.params as { slug: string; text: string };
    const author = getUserFromToken(request);
    const article = await db.article.findOneOrFail({ slug });
    const comment = db.comment.create({ author, article, text });

    // mention this is in fact a no-op, as it will be automatically propagated by setting Comment.author
    article.comments.add(comment);

    // mention we don't need to persist anything explicitly
    await db.em.flush();

    return comment;
  });

  // create article
  app.post('/', async request => {
    const { title, description, text } = request.body as { title: string; description: string; text: string };
    const author = getUserFromToken(request);
    const article = db.article.create({
      title, description, text,
      author,
    });

    await db.em.flush();

    return article;
  });

  // update article
  app.patch('/:id', async request => {
    const user = getUserFromToken(request);
    const params = request.params as { id: string };
    const article = await db.article.findOneOrFail(+params.id);
    verifyArticlePermissions(user, article);
    wrap(article).assign(request.body as Article);
    await db.em.flush();

    return article;
  });

  // delete article
  app.delete('/:id', async request => {
    const user = getUserFromToken(request);
    const params = request.params as { id: string };
    const article = await db.article.findOne(+params.id);

    if (!article) {
      return { notFound: true };
    }

    verifyArticlePermissions(user, article);
    // mention `nativeDelete` alternative if we don't care about validations much
    await db.em.remove(article).flush();

    return { success: true };
  });
}
