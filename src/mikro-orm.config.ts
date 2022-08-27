import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { User } from './entities/User.js';

export function defineConfig(options: Options) {
  return options;
}

export default defineConfig({
  type: 'sqlite',
  dbName: 'sqlite.db',
  entities: [User],
  metadataProvider: TsMorphMetadataProvider,
  highlighter: new SqlHighlighter(),
  seeder: {
    path: 'dist/seeders',
    pathTs: 'src/seeders',
  },
  debug: true,
});
