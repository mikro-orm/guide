import { defineEntity, type InferEntity, p } from '@mikro-orm/sqlite';
import { BaseEntity } from '../common/base.entity.js';
import { ArticleSchema } from './article.entity.js';

export const TagSchema = defineEntity({
  name: 'Tag',
  extends: BaseEntity,
  properties: {
    name: p.string().length(20),
    articles: () => p.manyToMany(ArticleSchema).mappedBy('tags'),
  },
});

export type Tag = InferEntity<typeof TagSchema>;
