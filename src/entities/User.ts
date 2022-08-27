import crypto from 'node:crypto';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property
} from '@mikro-orm/core';
import { Article } from './Article.js';
import { UserRepository } from '../repositories/UserRepository.js';

@Entity({ customRepository: () => UserRepository })
export class User {

  [EntityRepositoryType]?: UserRepository;
  [OptionalProps]?: 'bio' | 'image';

  @PrimaryKey()
  id!: number;

  @Property()
  username: string;

  @Property({ hidden: true })
  email: string;

  @Property({ type: 'text' })
  bio: string = '';

  @Property()
  image: string = '';

  @Property({ hidden: true })
  password: string;

  @OneToMany(() => Article, article => article.author, { hidden: true })
  articles = new Collection<Article>(this);

  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = crypto.createHmac('sha256', password).digest('hex');
  }

}
