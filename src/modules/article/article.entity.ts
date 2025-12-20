import { defineEntity, type InferEntity, p } from '@mikro-orm/sqlite';
import { BaseEntity } from '../common/base.entity.js';
import { User } from '../user/user.entity.js';
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
  tableName: 'article',
  repository: () => ArticleRepository,
  extends: BaseEntity,
  properties: {
    slug: p.string().unique().onCreate(article => convertToSlug(article.title)),
    title: p.string().index(),
    description: p.string().length(1000),
    text: p.text().lazy(),
    tags: () => p.manyToMany(TagSchema),
    author: () => p.manyToOne(User).ref(),
    comments: () => p.oneToMany(CommentSchema).mappedBy('article').eager().orphanRemoval(),
  },
});

export type Article = InferEntity<typeof ArticleSchema>;
