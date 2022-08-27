import { Entity, ManyToOne, Property, Ref } from '@mikro-orm/sqlite';
import { Article } from './article.entity.js';
import { User } from '../user/user.entity.js';
import { BaseEntity } from '../common/base.entity.js';

@Entity()
export class Comment extends BaseEntity {

  @Property({ length: 1000 })
  text!: string;

  @ManyToOne()
  article!: Ref<Article>;

  @ManyToOne()
  author!: Ref<User>;

}
