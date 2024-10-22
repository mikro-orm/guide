import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/sqlite"
import { UUID } from "node:crypto"
import { Person } from "../person.entity.js"

@Entity()
export class FullName {
    @PrimaryKey()
    id: UUID

    @Property()
    fullName: string

    @Property({ fieldName: "comment" })
    comment?: string

    @ManyToOne(() => Person, { fieldName: "person_id" })
    person: Person

    constructor(
        fullName: string,
        person: Person
    ) {
        this.id = crypto.randomUUID()
        this.fullName = fullName
        this.person = person
    }
}