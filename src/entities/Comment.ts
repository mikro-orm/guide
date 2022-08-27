import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Article } from './Article.js';
import { User } from './User.js';

@Entity()
export class Comment {

  @PrimaryKey()
  id!: number;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: 'text' })
  body: string;

  @ManyToOne()
  article: Article;

  @ManyToOne()
  author: User;

  constructor(author: User, article: Article, body: string) {
    this.author = author;
    this.article = article;
    this.body = body;
  }

}
