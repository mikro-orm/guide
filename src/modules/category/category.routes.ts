import { FastifyInstance } from "fastify"
import { initORM, Services } from "../../db.js"
import { Category } from "./category.entity.js"
import { Loaded } from "@mikro-orm/core"

export async function registerCategoryRoutes(app: FastifyInstance) {
    const db: Services = await initORM()

    app.get('/', async () => {
        const categories: Loaded<Category, "subCategories">[] = await db.category.findAll({
            populate: ['subCategories']
        })

        return mapCategories(categories)
    })

    function mapCategories(categories: Category[]): { name: string; subCategories: string[] }[] {
        return categories.map(category => ({
            name: category.name,
            subCategories: category.subCategories.getItems().map(subCategory => subCategory.name)
        }))
    }

}