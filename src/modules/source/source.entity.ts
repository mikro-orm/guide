import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/sqlite"
import { UUID } from "node:crypto"
import { Person } from "../person/person.entity.js"
import { SourceRepository } from "./source.repository.js"

@Entity({ repository: () => SourceRepository })
export class Source {
    @PrimaryKey({ type: "text" })
    id: UUID

    @ManyToOne(() => Person)
    person: Person

    @Enum()
    sourceType: SourceType

    @Property()
    source: string

    constructor(person: Person, sourceType: SourceType, source: string) {
        this.id = crypto.randomUUID()
        this.person = person
        this.sourceType = sourceType
        this.source = source
    }

    static getSourceType(sourceType: "ELULUGU" | "RAAMAT" | "PILT"): SourceType {
        switch (sourceType) {
            case "ELULUGU": return SourceType.DATA_URL
            case "PILT": return SourceType.IMAGE_URL
            case "RAAMAT": return SourceType.BOOK
        }
    }
}

export enum SourceType {
    IMAGE_URL = 'IMAGE_URL',
    DATA_URL = 'DATA_URL',
    BOOK = 'BOOK'
}