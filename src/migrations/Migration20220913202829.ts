import { Migration } from '@mikro-orm/migrations';

export class Migration20220913202829 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `tag` (`id` integer not null primary key autoincrement, `created_at` datetime not null, `updated_at` datetime not null, `name` text not null);');

    this.addSql('create table `user` (`id` integer not null primary key autoincrement, `created_at` datetime not null, `updated_at` datetime not null, `full_name` text not null, `email` text not null, `password` text not null, `bio` text not null);');

    this.addSql('create table `article` (`id` integer not null primary key autoincrement, `created_at` datetime not null, `updated_at` datetime not null, `slug` text not null, `title` text not null, `description` text not null, `text` text not null, `author_id` integer not null, constraint `article_author_id_foreign` foreign key(`author_id`) references `user`(`id`) on update cascade);');
    this.addSql('create unique index `article_slug_unique` on `article` (`slug`);');
    this.addSql('create index `article_title_index` on `article` (`title`);');
    this.addSql('create index `article_author_id_index` on `article` (`author_id`);');

    this.addSql('create table `article_tags` (`article_id` integer not null, `tag_id` integer not null, constraint `article_tags_article_id_foreign` foreign key(`article_id`) references `article`(`id`) on delete cascade on update cascade, constraint `article_tags_tag_id_foreign` foreign key(`tag_id`) references `tag`(`id`) on delete cascade on update cascade, primary key (`article_id`, `tag_id`));');
    this.addSql('create index `article_tags_article_id_index` on `article_tags` (`article_id`);');
    this.addSql('create index `article_tags_tag_id_index` on `article_tags` (`tag_id`);');
  }

}
