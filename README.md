Create project

```bash
mkdir tutorial && cd tutorial
mkdir tutorial src
yarn init
yarn add @mikro-orm/core @mikro-orm/sqlite
yarn add -D @mikro-orm/cli typescript ts-node
```

TS setup

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2020",
    "strict": true,
    "outDir": "dist"
  },
  "include": [
    "./src/**/*.ts"
  ]
}
```

NPM scripts

```ts
ts-node
tsc
node dist
```

CLI config

```ts
import { Options } from '@mikro-orm/core';
import { User } from './entities/User';

const config: Options = {
  type: 'sqlite',
  dbName: 'sqlite.db',
  entities: [User],
  seeder: {
    path: 'dist/seeders',
    pathTs: 'src/seeders',
  },
  debug: false,
};

export default config;
```

## Things to showcase

- start with defining some entities, create first request handler, show the global context validation error
- first create simple handler, test it and show it fails because schema is not created
- use node 18 test runner?
- when setting up CLI, show the need for configuration of CLI config paths and ts-node, mention its CLI only thing
- also mention that the test does not exit the process without calling `orm.close()`
- show how to use schema generator, notice we can call it during app start to have the auto sync, but people need to be careful with that...
- show seeding so we can have test data
- next section should talk about migrations, and show the initial migrations switch as we already have schema created
- carefully mention the imports from driver package
- general CRUD with entities
- get endpoint, 404 via config, note about local override
- cascading
- default values
- explain constructor usage invariant and note the flag to force their usage
- repositories with custom methods, maybe note about base entity repo
- using QB
- em.create() and that it's required for using interface only entities
- using virtual entities
- auditing via `onFlush` even
