import { Migration } from '@mikro-orm/migrations';

export class Migration20260207165252 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`user__temp_alter\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`full_name\` text not null, \`email\` text not null, \`password\` text not null, \`bio\` text not null default '', \`social\` json null);`);
    this.addSql(`insert into \`user__temp_alter\` select \`id\`, \`created_at\`, \`updated_at\`, \`full_name\`, \`email\`, \`password\`, \`bio\`, \`social\` from \`user\`;`);
    this.addSql(`drop table \`user\`;`);
    this.addSql(`alter table \`user__temp_alter\` rename to \`user\`;`);
    this.addSql(`create unique index \`user_email_unique\` on \`user\` (\`email\`);`);
    this.addSql(`pragma foreign_keys = on;`);

    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`article__temp_alter\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`slug\` text not null, \`title\` text not null, \`description\` text not null, \`text\` text not null, \`author_id\` integer not null, constraint \`article_author_id_foreign\` foreign key (\`author_id\`) references \`user\` (\`id\`));`);
    this.addSql(`insert into \`article__temp_alter\` select \`id\`, \`created_at\`, \`updated_at\`, \`slug\`, \`title\`, \`description\`, \`text\`, \`author_id\` from \`article\`;`);
    this.addSql(`drop table \`article\`;`);
    this.addSql(`alter table \`article__temp_alter\` rename to \`article\`;`);
    this.addSql(`create unique index \`article_slug_unique\` on \`article\` (\`slug\`);`);
    this.addSql(`create index \`article_title_index\` on \`article\` (\`title\`);`);
    this.addSql(`create index \`article_author_id_index\` on \`article\` (\`author_id\`);`);
    this.addSql(`pragma foreign_keys = on;`);

    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`comment__temp_alter\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`text\` text not null, \`article_id\` integer not null, \`author_id\` integer not null, \`deleted_at\` datetime null, constraint \`comment_article_id_foreign\` foreign key (\`article_id\`) references \`article\` (\`id\`), constraint \`comment_author_id_foreign\` foreign key (\`author_id\`) references \`user\` (\`id\`));`);
    this.addSql(`insert into \`comment__temp_alter\` select \`id\`, \`created_at\`, \`updated_at\`, \`text\`, \`article_id\`, \`author_id\`, null as \`deleted_at\` from \`comment\`;`);
    this.addSql(`drop table \`comment\`;`);
    this.addSql(`alter table \`comment__temp_alter\` rename to \`comment\`;`);
    this.addSql(`create index \`comment_article_id_index\` on \`comment\` (\`article_id\`);`);
    this.addSql(`create index \`comment_author_id_index\` on \`comment\` (\`author_id\`);`);
    this.addSql(`pragma foreign_keys = on;`);
  }

  override async down(): Promise<void> {
    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`article__temp_alter\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`slug\` TEXT not null, \`title\` TEXT not null, \`description\` TEXT not null, \`text\` TEXT not null, \`author_id\` INTEGER not null, constraint \`article_author_id_foreign\` foreign key (\`author_id\`) references \`user\` (\`id\`) on update cascade on delete no action);`);
    this.addSql(`insert into \`article__temp_alter\` select \`id\`, \`created_at\`, \`updated_at\`, \`slug\`, \`title\`, \`description\`, \`text\`, \`author_id\` from \`article\`;`);
    this.addSql(`drop table \`article\`;`);
    this.addSql(`alter table \`article__temp_alter\` rename to \`article\`;`);
    this.addSql(`create index \`article_author_id_index\` on \`article\` (\`author_id\`);`);
    this.addSql(`create index \`article_title_index\` on \`article\` (\`title\`);`);
    this.addSql(`create unique index \`article_slug_unique\` on \`article\` (\`slug\`);`);
    this.addSql(`pragma foreign_keys = on;`);

    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`comment__temp_alter\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`text\` TEXT not null, \`article_id\` INTEGER not null, \`author_id\` INTEGER not null, constraint \`comment_author_id_foreign\` foreign key (\`author_id\`) references \`user\` (\`id\`) on update cascade on delete no action, constraint \`comment_article_id_foreign\` foreign key (\`article_id\`) references \`article\` (\`id\`) on update cascade on delete no action);`);
    this.addSql(`insert into \`comment__temp_alter\` select \`id\`, \`created_at\`, \`updated_at\`, \`text\`, \`article_id\`, \`author_id\` from \`comment\`;`);
    this.addSql(`drop table \`comment\`;`);
    this.addSql(`alter table \`comment__temp_alter\` rename to \`comment\`;`);
    this.addSql(`create index \`comment_author_id_index\` on \`comment\` (\`author_id\`);`);
    this.addSql(`create index \`comment_article_id_index\` on \`comment\` (\`article_id\`);`);
    this.addSql(`pragma foreign_keys = on;`);

    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`user__temp_alter\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`full_name\` TEXT not null, \`email\` TEXT not null, \`password\` TEXT not null, \`bio\` TEXT not null, \`social\` json null);`);
    this.addSql(`insert into \`user__temp_alter\` select \`id\`, \`created_at\`, \`updated_at\`, \`full_name\`, \`email\`, \`password\`, \`bio\`, \`social\` from \`user\`;`);
    this.addSql(`drop table \`user\`;`);
    this.addSql(`alter table \`user__temp_alter\` rename to \`user\`;`);
    this.addSql(`pragma foreign_keys = on;`);
  }

}
