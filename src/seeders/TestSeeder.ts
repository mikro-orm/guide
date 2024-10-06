// import type { EntityManager } from '@mikro-orm/sqlite';
// import { Seeder } from '@mikro-orm/seeder';
//
// export class TestSeeder extends Seeder {
//
//   async run(em: EntityManager): Promise<void> {
//     const author = em.create(User, {
//       fullName: 'Foo Bar',
//       email: 'foo@bar.com',
//       password: 'password123',
//       social: { twitter: '@foobar' },
//       articles: [
//         {
//           title: 'title 1/3',
//           description: 'desc 1/3',
//           text: 'text text text 1/3',
//           tags: [{ id: 1, name: 'foo1' }, { id: 2, name: 'foo2' }],
//         },
//         {
//           title: 'title 2/3',
//           description: 'desc 2/3',
//           text: 'text text text 2/3',
//           tags: [{ id: 2, name: 'foo2' }],
//         },
//         {
//           title: 'title 3/3',
//           description: 'desc 3/3',
//           text: 'text text text 3/3',
//           tags: [{ id: 2, name: 'foo2' }, { id: 3, name: 'foo3' }],
//         },
//       ],
//     });
//
//     em.assign(author.articles[0], {
//       comments: [
//         { author, text: `random comment ${Math.random()}` },
//         { author, text: `random comment ${Math.random()}` },
//       ],
//     });
//
//     em.assign(author.articles[1], {
//       comments: [
//         { author, text: `random comment ${Math.random()}` },
//       ],
//     });
//
//     em.assign(author.articles[2], {
//       comments: [
//         { author, text: `random comment ${Math.random()}` },
//         { author, text: `random comment ${Math.random()}` },
//         { author, text: `random comment ${Math.random()}` },
//       ],
//     });
//   }
//
// }
