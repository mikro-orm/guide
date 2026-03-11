import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    ssr: 'src/server.ts',
    outDir: 'dist',
    sourcemap: true,
    target: 'node22',
  },
  ssr: {
    noExternal: ['@mikro-orm/sqlite', '@mikro-orm/sql', '@mikro-orm/core'],
  },
});
