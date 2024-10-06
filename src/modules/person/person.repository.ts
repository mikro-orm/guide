import { EntityRepository } from "@mikro-orm/sqlite"
import { Person } from "./person.entity.js"

export class PersonRepository extends EntityRepository<Person> {

}