import { EntityRepository } from "@mikro-orm/sqlite"
import { Category } from "./category.entity.js"

export class CategoryRepository extends EntityRepository<Category>{
}