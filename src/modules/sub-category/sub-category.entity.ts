import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/sqlite"
import { UUID } from "node:crypto"
import { Category } from "../category/category.entity.js"
import { Person } from "../person/person.entity.js"
import { SubCategoryRepository } from "./sub-category.repository.js"

@Entity({ repository: () => SubCategoryRepository })
export class SubCategory {
    @PrimaryKey({ type: "text" })
    id: UUID

    @Property()
    name: string

    @ManyToOne(() => Category)
    category: Category

    @ManyToMany(() => Person, person => person.subCategories)
    people: Collection<Person> = new Collection<Person>(this)

    constructor(name: string, category: Category) {
        this.id = crypto.randomUUID()
        this.name = name
        this.category = category
    }
}