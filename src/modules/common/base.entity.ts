import { p, defineEntity } from '@mikro-orm/sqlite';

export const BaseSchema = defineEntity({
  name: 'BaseEntity',
  abstract: true,
  properties: {
    id: p.integer().primary(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p.datetime().onCreate(() => new Date()).onUpdate(() => new Date()),
  },
});

export abstract class BaseEntity extends BaseSchema.class {}

BaseSchema.setClass(BaseEntity);
