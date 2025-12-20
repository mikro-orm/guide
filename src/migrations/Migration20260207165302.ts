import { Migration } from '@mikro-orm/migrations';

export class Migration20260207165302 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create view \`article_listing\` as 
    select a.slug, a.title, a.description, a.author_id as author,
           u.full_name as author_name,
           (select count(*) from comment c where c.article_id = a.id) as total_comments,
           (select group_concat(distinct t.name) from article_tags at2
              join tag t on t.id = at2.tag_id
              where at2.article_id = a.id) as tags
    from article a
    join user u on u.id = a.author_id;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop view if exists \`article_listing\`;`);
  }

}
