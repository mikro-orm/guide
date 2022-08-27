import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
  ref,
  Ref,
  Rel,
  t,
} from '@mikro-orm/sqlite';
import { BaseEntity } from '../common/base.entity.js';
import { User } from '../user/user.entity.js';
import { Comment } from './comment.entity.js';
import { Tag } from './tag.entity.js';
import { ArticleRepository } from './article.repository.js';

function convertToSlug(title: string) {
  return title.toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
}

@Entity({ repository: () => ArticleRepository })
export class Article extends BaseEntity<'slug'> {

  [EntityRepositoryType]?: ArticleRepository;

  @Property({ unique: true })
  slug: string;

  @Property({ index: true })
  title: string;

  @Property({ length: 1000 })
  description: string;

  @Property({ type: t.text, lazy: true })
  text: string;

  @ManyToMany()
  tags = new Collection<Tag>(this);

  @ManyToOne()
  author: Ref<User>;

  @OneToMany({ mappedBy: 'article', eager: true, orphanRemoval: true })
  comments = new Collection<Comment>(this);

  constructor(author: Rel<User>, title: string, description = '', text = '') {
    super();
    this.author = ref(author);
    this.title = title;
    this.description = description;
    this.text = text;
    this.slug = convertToSlug(title);
  }

}
