import {
    Cascade,
    Collection,
    Entity,
    EntityRepositoryType,
    ManyToMany,
    OneToMany,
    PrimaryKey,
    Property
} from "@mikro-orm/sqlite"
import { PersonRepository } from "./person.repository.js"
import { UUID } from "node:crypto"
import { Nickname } from "./nickname/nickname.entity.js"
import { Category } from "../category/category.entity.js"
import { Source } from "./source/source.entity.js"
import { SubCategory } from "../sub-category/sub-category.entity.js"
import { FullName } from "./fullName/full-name.entity.js"

@Entity({ repository: () => PersonRepository })
export class Person {
    [EntityRepositoryType]?: PersonRepository;

    @PrimaryKey({ type: "text" })
    id: UUID

    @Property({ nullable: true })
    lastName?: string

    @Property({ nullable: true, fieldName: "first_name" })
    firstName?: string

    @Property({ nullable: true, fieldName: "date_of_birth" })
    dateOfBirth?: string

    @Property({ nullable: true })
    birthplace?: string

    @Property({ nullable: true, fieldName: "date_of_death" })
    dateOfDeath?: string

    @Property({ nullable: true, fieldName: "description" })
    description?: string

    @Property({ fieldName: "x_coordinate", columnType: "real" })
    xCoordinate: number

    @Property({ fieldName: "y_coordinate", columnType: "real" })
    yCoordinate: number

    @OneToMany(() => FullName, fullName => fullName.person, { cascade: [Cascade.ALL], orphanRemoval: true })
    fullNames: Collection<FullName> = new Collection<FullName>(this)

    @OneToMany(() => Nickname, nickname => nickname.person, { cascade: [Cascade.ALL], orphanRemoval: true })
    nicknames: Collection<Nickname> = new Collection<Nickname>(this)

    @ManyToMany(() => Category)
    categories: Collection<Category> = new Collection<Category>(this)

    @ManyToMany(() => SubCategory)
    subCategories: Collection<SubCategory> = new Collection<SubCategory>(this)

    @OneToMany(() => Source, source => source.person, { cascade: [Cascade.ALL], orphanRemoval: true })
    sources: Collection<Source> = new Collection<Source>(this)

    constructor(
        init: Partial<Person>
    ) {
        this.id = crypto.randomUUID()
        Object.assign(this, init)
    }
}