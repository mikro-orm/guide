import { FindOptions, sql, EntityRepository } from '@mikro-orm/sqlite';
import { Article } from './article.entity.js';
import { ArticleListing } from './article-listing.entity.js';
import { Comment } from './comment.entity.js';

// extending the EntityRepository exported from driver package, so we can access things like the QB factory
export class ArticleRepository extends EntityRepository<Article> {

  listArticlesQuery() {
    // sub-query for total number of comments
    const totalComments = this.em.createQueryBuilder(Comment)
        .count()
        .where({ article: sql.ref('a.id') })
        .as('totalComments');

    // sub-query for all used tags
    const usedTags = this.em.createQueryBuilder(Article, 'aa')
        .select(sql`group_concat(distinct t.name)`) // mark raw query fragment with `sql` helper otherwise it would be escaped
        .join('aa.tags', 't')
        .where({ 'aa.id': sql.ref('a.id') })
        .groupBy('aa.author')
        .as('tags');

    // build final query
    return this.createQueryBuilder('a')
        .select(['slug', 'title', 'description', 'author'])
        .addSelect(sql.ref('u.full_name').as('authorName'))
        .join('author', 'u')
        .addSelect([totalComments, usedTags]);
  }

  async listArticles(options: FindOptions<ArticleListing>) {
    const [items, total] = await this.em.findAndCount(ArticleListing, {}, options);
    return { items, total };
  }

}
