import { Entity, EntityManager, Property } from '@mikro-orm/sqlite';
import { Article } from './article.entity.js';

@Entity({
  expression: (em: EntityManager) => {
    return em.getRepository(Article).listArticlesQuery();
  },
})
export class ArticleListing {

  @Property()
  slug!: string;

  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property()
  tags!: string[];

  @Property()
  author!: number;

  @Property()
  authorName!: string;

  @Property()
  totalComments!: number;

}
