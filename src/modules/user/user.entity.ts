import {
  defineEntity,
  type InferEntity,
  type EventArgs,
  p,
} from '@mikro-orm/core';
import { hash, verify } from 'argon2';
import { BaseSchema } from '../common/base.entity.js';
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

export type ISocial = InferEntity<typeof SocialSchema>;

async function hashPassword(args: EventArgs<User>) {
  // hash only if the value changed
  const password = args.changeSet?.payload.password;

  if (typeof password === 'string') {
    args.entity.password = await hash(password);
  }
}

export const UserSchema = defineEntity({
  name: 'User',
  extends: BaseSchema,
  repository: () => UserRepository,
  properties: {
    fullName: p.string(),
    email: p.string(),
    password: p.string().hidden().lazy(),
    bio: p.text().default(''),
    articles: () => p.oneToMany(ArticleSchema).mappedBy('author'),
    token: p.string().persist(false).nullable(),
    social: () => p.embedded(SocialSchema).object().nullable(),
  },
});

export class User extends UserSchema.class {

  async verifyPassword(password: string) {
    return verify(this.password, password);
  }

}

UserSchema.setClass(User);
UserSchema.addHook('beforeCreate', hashPassword);
UserSchema.addHook('beforeUpdate', hashPassword);
