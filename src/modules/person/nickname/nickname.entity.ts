import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/sqlite"
import { UUID } from "node:crypto"
import { Person } from "../person.entity.js"

@Entity()
export class Nickname {
    @PrimaryKey()
    id: UUID

    @Property()
    nickname: string

    @Property({ fieldName: "comment" })
    comment?: string

    @ManyToOne(() => Person, { fieldName: "person_id" })
    person: Person

    constructor(
        nickname: string,
        person: Person
    ) {
        this.id = crypto.randomUUID()
        this.nickname = nickname
        this.person = person
    }
}