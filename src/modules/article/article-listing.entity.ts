import { defineEntity, p, type InferEntity } from '@mikro-orm/sqlite';

export const ArticleListingSchema = defineEntity({
  name: 'ArticleListing',
  view: true,
  expression: `
    select a.slug, a.title, a.description, a.author_id as author,
           u.full_name as author_name,
           (select count(*) from comment c where c.article_id = a.id) as total_comments,
           (select group_concat(distinct t.name) from article_tags at2
              join tag t on t.id = at2.tag_id
              where at2.article_id = a.id) as tags
    from article a
    join user u on u.id = a.author_id
  `,
  properties: {
    slug: p.string().primary(),
    title: p.string(),
    description: p.string(),
    tags: p.array(),
    author: p.integer(),
    authorName: p.string(),
    totalComments: p.integer(),
  },
});

export type ArticleListing = InferEntity<typeof ArticleListingSchema>;
