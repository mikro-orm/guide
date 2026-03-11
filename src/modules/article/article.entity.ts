import { defineEntity, type InferEntity, p } from '@mikro-orm/core';
import { BaseSchema } from '../common/base.entity.js';
import { UserSchema } from '../user/user.entity.js';
import { CommentSchema } from './comment.entity.js';
import { TagSchema } from './tag.entity.js';
import { ArticleRepository } from './article.repository.js';

function convertToSlug(title: string) {
  return title.toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
}

export const ArticleSchema = defineEntity({
  name: 'Article',
  extends: BaseSchema,
  repository: () => ArticleRepository,
  properties: {
    slug: p.string().unique().onCreate(article => convertToSlug(article.title)),
    title: p.string().index(),
    description: p.string().length(1000).onCreate(article => article.text.substring(0, 999) + '…'),
    text: p.text().lazy(),
    author: () => p.manyToOne(UserSchema).ref(),
    tags: () => p.manyToMany(TagSchema),
    comments: () => p.oneToMany(CommentSchema).mappedBy('article').eager().orphanRemoval(),
  },
});

export type IArticle = InferEntity<typeof ArticleSchema>;
