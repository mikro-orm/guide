import { Cascade, Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from "@mikro-orm/sqlite"
import { UUID } from "node:crypto"
import { Person } from "../person/person.entity.js"
import { SubCategory } from "../sub-category/sub-category.entity.js"
import { CategoryRepository } from "./category.repository.js"

@Entity({ repository: () => CategoryRepository })
export class Category {
    @PrimaryKey({ type: "text" })
    id: UUID

    @Property()
    name: string

    @OneToMany(() => SubCategory, subCategory => subCategory.category, { cascade: [Cascade.ALL], orphanRemoval: true, eager: true })
    subCategories: Collection<SubCategory> = new Collection<SubCategory>(this)

    @ManyToMany(() => Person, person => person.categories)
    people: Collection<Person> = new Collection<Person>(this)

    constructor(name: string) {
        this.id = crypto.randomUUID()
        this.name = name
    }
}