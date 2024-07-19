import { Migration } from '@mikro-orm/migrations';

export class Migration20240601145446 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add column `social` json null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` drop column `social`;');
  }

}
