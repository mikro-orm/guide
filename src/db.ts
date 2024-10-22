import { MikroORM, Options, EntityManager } from '@mikro-orm/sqlite'
import config from './mikro-orm.config.js'
import { CategoryRepository } from "./modules/category/category.repository.js"
import { Category } from "./modules/category/category.entity.js"
import { PersonRepository } from "./modules/person/person.repository.js"
import { Person } from "./modules/person/person.entity.js"
import { SubCategoryRepository } from "./modules/sub-category/sub-category.repository.js"
import { SubCategory } from "./modules/sub-category/sub-category.entity.js"
import { SourceRepository } from "./modules/person/source/source.repository.js"
import { Source } from "./modules/person/source/source.entity.js"

export interface Services {
  orm: MikroORM
  em: EntityManager
  category: CategoryRepository
  subCategory: SubCategoryRepository
  person: PersonRepository
  source: SourceRepository
}

let cache: Services

export async function initORM(options?: Options): Promise<Services> {
  if (cache) {
    return cache
  }

  // allow overriding config options for testing
  const orm = await MikroORM.init({
    ...config,
    ...options,
  })

  // save to cache before returning
  return cache = {
    orm,
    em: orm.em,
    category: orm.em.getRepository(Category),
    subCategory: orm.em.getRepository(SubCategory),
    person: orm.em.getRepository(Person),
    source: orm.em.getRepository(Source)
  }
}
