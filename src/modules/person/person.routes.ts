import { FastifyInstance } from "fastify"
import { initORM, Services } from "../../db.js"
import { Person } from "./person.entity.js"
import { PersonDto } from "./person.dto.js"
import { Source } from "./source/source.entity.js"
import { NotFoundError } from "@mikro-orm/sqlite"
import * as process from "node:process"
import { Nickname } from "./nickname/nickname.entity.js"
import { UUID } from "node:crypto"
import { FullName } from "./fullName/full-name.entity.js"

export async function registerPersonRoutes(app: FastifyInstance) {
    const db: Services = await initORM()

    app.get('/', async (request, reply) => {
        try {
            const people = await db.person.findAll({ populate: ['nicknames', 'categories', 'sources', 'subCategories'] })

            return reply.status(200).send(people)
        } catch (e) {
            reply.status(404).send({ message: 'no people found!' })
        }
    })

    app.get('/:id', async (request, reply) => {
        const { id } = request.params as { id: UUID }
        try {
            const person = await db.person.findOneOrFail({ id }, { populate: ['nicknames', 'categories.name', 'sources', 'subCategories'] })

            return reply.status(200).send(person)
        } catch (error) {
            return reply.status(404).send({ message: 'Person not found!' })
        }
    })

    app.post('/', async (request, reply) => {
        console.log(request.headers)
        const apiKey: string | undefined = request.headers["x-api-key"] as string
        if (!apiKey) {
            app.log.warn(`Request made for saving a person, but no API key was provided!`, request.ip, request.id)
            reply
                .status(400)
                .send({ message: `Please provide an API key!` })
            return
        } else {
            if (apiKey !== process.env.X_API_KEY) {
                app.log.warn(`Wrong API key provided for saving a person route!`, request.ip, request.id)
                reply
                    .status(403)
                    .send({ message: `Wrong API key provided, unauthorized access attempt!` })
                return
            }
        }

        const personDto: PersonDto = request.body as PersonDto

        const person: Person = db.person.create(new Person({
            lastName: personDto.lastName,
            firstName: personDto.firstName ? personDto.firstName : undefined,
            dateOfBirth: personDto.dateOfBirth ? personDto.dateOfBirth : undefined,
            birthplace: personDto.birthplace,
            dateOfDeath: personDto.dateOfDeath ? personDto.dateOfDeath : undefined,
            description: personDto.description,
            xCoordinate: personDto.xCoordinate,
            yCoordinate: personDto.yCoordinate
        }))

        if (personDto.fullNames && personDto.fullNames.length > 0) {
            personDto.fullNames.map(fullName => {
                person.fullNames.add(new FullName(fullName, person))
            })
        }

        if (personDto.nicknames && personDto.nicknames.length > 0) {
            personDto.nicknames.map(nickname => {
                person.nicknames.add(new Nickname(nickname, person))
            })
        }

        try {
            const categories = await db.category.find({ name: { $in: personDto.categories } })
            person.categories.add(categories)
        } catch (e) {
            const notFoundError: boolean = e instanceof NotFoundError
            app.log.error(`An error has occurred while fetching categories from the database via user provided categories: ${personDto.categories}\nError: ${e}`)
            reply
                .code(notFoundError ? 404 : 500)
                .type('application/json')
                .send({ error: `Internal Server Error saving person for the following categories: ${personDto.subCategories}\ne: ${e}` })
            return
        }

        if (personDto.subCategories && personDto.subCategories.length > 0) {
            try {
                const subCategories = await db.subCategory.find({ name: { $in: personDto.subCategories } });
                person.subCategories.add(subCategories)
            } catch (e) {
                const notFoundError: boolean = e instanceof NotFoundError
                app.log.error(`An error has occurred while fetching sub categories from the database via user provided subCategories: ${personDto.subCategories}\nError: ${e}`)
                reply
                    .code(notFoundError ? 404 : 500)
                    .type('application/json')
                    .send({ error: `Internal Server Error saving person for the following sub categories: ${personDto.subCategories}\ne: ${e}` })
                return
            }
        }

        personDto.sources.map(source => {
            const newSource: Source = new Source(person, Source.getSourceType(source.sourceType), source.source)
            if (source.location) newSource.location = source.location
            person.sources.add(newSource)
        })

        try {
            await db.em.flush()
        } catch (e) {
            app.log.error(`An error has occurred while flushing the changes made for the person to be inserted to db: ${person}\nError: ${e}`)
            reply
                .code(500)
                .type('application/json')
                .send({ error: `Internal Server Error saving person for the following sub categories: ${personDto.subCategories}\ne: ${e}` })
            return
        }
    })
}