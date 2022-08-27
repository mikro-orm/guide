import {
  BeforeCreate, BeforeUpdate, Collection, Embeddable, Embedded,
  Entity, EntityRepositoryType, EventArgs, OneToMany, Property,
} from '@mikro-orm/sqlite';
import { hash, verify } from 'argon2';
import { BaseEntity } from '../common/base.entity.js';
import { Article } from '../article/article.entity.js';
import { UserRepository } from './user.repository.js';

@Embeddable()
export class Social {

  @Property()
  twitter?: string;

  @Property()
  facebook?: string;

  @Property()
  linkedin?: string;

}

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity<'bio'> {

  [EntityRepositoryType]?: UserRepository;

  @Property()
  fullName: string;

  @Property({ hidden: true })
  email: string;

  @Property({ hidden: true, lazy: true })
  password: string;

  @Property({ type: 'text' })
  bio = '';

  @OneToMany(() => Article, article => article.author, { hidden: true })
  articles = new Collection<Article>(this);

  @Property({ persist: false })
  token?: string;

  @Embedded(() => Social, { object: true })
  social?: Social;

  constructor(fullName: string, email: string, password: string) {
    super();
    this.fullName = fullName;
    this.email = email;
    this.password = password;
  }

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword(args: EventArgs<User>) {
    // hash only if the value changed
    const password = args.changeSet?.payload.password;

    if (password) {
      this.password = await hash(password);
    }
  }

  async verifyPassword(password: string) {
    return verify(this.password, password);
  }

}
