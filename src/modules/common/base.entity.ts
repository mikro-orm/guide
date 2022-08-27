import { OptionalProps, PrimaryKey, Property } from '@mikro-orm/sqlite';

export abstract class BaseEntity<Optional = never> {

  [OptionalProps]?: 'createdAt' | 'updatedAt' | Optional;

  @PrimaryKey()
  id!: number;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

}
