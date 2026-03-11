import { defineEntity, type InferEntity, p } from '@mikro-orm/core';
import { ArticleSchema } from './article.entity.js';
import { UserSchema } from '../user/user.entity.js';
import { BaseSchema } from '../common/base.entity.js';

export const CommentSchema = defineEntity({
  name: 'Comment',
  extends: BaseSchema,
  properties: {
    text: p.string(),
    article: () => p.manyToOne(ArticleSchema).ref(),
    author: () => p.manyToOne(UserSchema).ref(),
    deletedAt: p.datetime().nullable(),
  },
  filters: {
    softDelete: { name: 'softDelete', cond: { deletedAt: null }, default: true },
  },
});

export type IComment = InferEntity<typeof CommentSchema>;
