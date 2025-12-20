import {
  defineEntity,
  p,
  ref,
  type EventArgs,
  type InferEntity,
} from '@mikro-orm/sqlite';
import { hash, verify } from 'argon2';
import { BaseEntity } from '../common/base.entity.js';
import { ArticleSchema } from '../article/article.entity.js';
import { UserRepository } from './user.repository.js';

export const SocialSchema = defineEntity({
  name: 'Social',
  embeddable: true,
  properties: {
    twitter: p.string().nullable(),
    facebook: p.string().nullable(),
    linkedin: p.string().nullable(),
  },
});

export type Social = InferEntity<typeof SocialSchema>;

export const UserSchema = defineEntity({
  name: 'User',
  tableName: 'user',
  repository: () => UserRepository,
  extends: BaseEntity,
  properties: {
    fullName: p.string(),
    email: p.string().unique().hidden(),
    password: p.string().hidden().lazy().ref(),
    bio: p.text().default(''),
    articles: () => p.oneToMany(ArticleSchema).mappedBy('author').hidden(),
    token: p.string().nullable().persist(false),
    social: () => p.embedded(SocialSchema).object(true).nullable(),
  },
  hooks: {
    beforeCreate: ['hashPassword'],
    beforeUpdate: ['hashPassword'],
  },
});

export class User extends UserSchema.class {

  async hashPassword(args: EventArgs<User>) {
    // hash only if the value changed
    const password = args.changeSet?.payload.password;

    if (typeof password === 'string') {
      this.password = ref(await hash(password));
    }
  }

  async verifyPassword(password: string) {
    const hash = await this.password.loadOrFail();
    return verify(hash, password);
  }

}

UserSchema.setClass(User);
