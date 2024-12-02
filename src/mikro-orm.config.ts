import { defineConfig, GeneratedCacheAdapter, Options } from '@mikro-orm/sqlite';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { existsSync, readFileSync } from 'node:fs';
import * as process from "node:process"

const options = {} as Options;

if (process.env.NODE_ENV === 'production' && existsSync('./temp/metadata.json')) {
  options.metadataCache = {
    enabled: true,
    adapter: GeneratedCacheAdapter,
    // temp/metadata.json can be generated via `npx mikro-orm-esm cache:generate --combine`
    options: {
      data: JSON.parse(readFileSync('./temp/metadata.json', { encoding: 'utf8' })),
    },
  };
} else {
  options.metadataProvider = (await import('@mikro-orm/reflection')).TsMorphMetadataProvider;
}

export default defineConfig({
  // for simplicity, we use the SQLite database, as it's available pretty much everywhere
  //todo build script can't read process..env.DATABASE_HOSTNAME
  // dbName: 'kaardirakendus.db',
  dbName: process.env.DATABASE_HOSTNAME,
  // folder based discovery setup, using common filename suffix
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  // enable debug mode to log SQL queries and discovery information
  debug: true,
  // for vitest to get around `TypeError: Unknown file extension ".ts"` (ERR_UNKNOWN_FILE_EXTENSION)
  dynamicImportProvider: id => import(id),
  // for highlighting the SQL queries
  highlighter: new SqlHighlighter(),
  ...options,
});
