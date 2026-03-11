import { defineEntity, type InferEntity, type EntityManager, p } from '@mikro-orm/core';
import { ArticleSchema } from './article.entity.js';

export const ArticleListingSchema = defineEntity({
  name: 'ArticleListing',
  expression: (em: EntityManager) => {
    return em.getRepository(ArticleSchema).listArticlesQuery();
  },
  properties: {
    slug: p.string(),
    title: p.string(),
    description: p.string(),
    tags: p.array(),
    author: p.integer(),
    authorName: p.string(),
    totalComments: p.integer(),
  },
});

export type IArticleListing = InferEntity<typeof ArticleListingSchema>;
