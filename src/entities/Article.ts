import {
  ArrayType,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property
} from '@mikro-orm/core';
import slug from 'slug';
import { User } from './User.js';
import { Comment } from './Comment.js';

@Entity()
export class Article {

  [OptionalProps]?: 'body' | 'createdAt' | 'updatedAt' | 'tagList';

  @PrimaryKey()
  id!: number;

  @Property()
  slug: string;

  @Property()
  title: string;

  @Property()
  description: string;

  @Property({ type: 'text' })
  body: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: ArrayType })
  tagList: string[] = [];

  @ManyToOne(() => User)
  author: User;

  @OneToMany(() => Comment, comment => comment.article, { eager: true, orphanRemoval: true })
  comments = new Collection<Comment>(this);

  @Property({ type: 'integer' })
  favoritesCount = 0;

  constructor(author: User, title: string, description = '', body = '') {
    this.author = author;
    this.title = title;
    this.description = description;
    this.body = body;
    this.slug = slug(title, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
  }

}
