import { SqlEntityRepository } from "@mikro-orm/sqlite"
import { Source } from "./source.entity.js"

export class SourceRepository extends SqlEntityRepository<Source>{

}