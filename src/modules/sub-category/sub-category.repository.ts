import { SqlEntityRepository } from "@mikro-orm/sqlite"
import { SubCategory } from "./sub-category.entity.js"

export class SubCategoryRepository extends SqlEntityRepository<SubCategory>{

}