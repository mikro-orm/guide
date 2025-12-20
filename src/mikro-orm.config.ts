import { defineConfig } from '@mikro-orm/sqlite';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { SocialSchema, UserSchema } from './modules/user/user.entity.js';
import { ArticleSchema } from './modules/article/article.entity.js';
import { ArticleListingSchema } from './modules/article/article-listing.entity.js';
import { TagSchema } from './modules/article/tag.entity.js';
import { CommentSchema } from './modules/article/comment.entity.js';
import { Migrator } from '@mikro-orm/migrations';
import { SoftDeleteSubscriber } from './modules/common/soft-delete.subscriber.js';

export default defineConfig({
  // for simplicity, we use the SQLite database, as it's available pretty much everywhere
  dbName: 'sqlite.db',
  // explicitly list your entities
  entities: [UserSchema, ArticleSchema, ArticleListingSchema, TagSchema, SocialSchema, CommentSchema],
  // enable debug mode to log SQL queries and discovery information
  debug: true,
  // for highlighting the SQL queries
  highlighter: new SqlHighlighter(),
  extensions: [Migrator],
  subscribers: [new SoftDeleteSubscriber()],
});
