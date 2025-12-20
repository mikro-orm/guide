import { defineEntity, type InferEntity, p } from '@mikro-orm/sqlite';
import { ArticleSchema } from './article.entity.js';
import { User } from '../user/user.entity.js';
import { BaseEntity } from '../common/base.entity.js';

export const CommentSchema = defineEntity({
  name: 'Comment',
  extends: BaseEntity,
  properties: {
    text: p.string(),
    article: () => p.manyToOne(ArticleSchema).ref(),
    author: () => p.manyToOne(User).ref(),
    deletedAt: p.datetime().nullable(),
  },
  filters: {
    softDelete: { name: 'softDelete', cond: { deletedAt: null }, default: true },
  },
});

export type Comment = InferEntity<typeof CommentSchema>;
