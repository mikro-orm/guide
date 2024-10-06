import { Expose, Type } from "class-transformer"
import { IsString, ValidateNested } from "class-validator"
import { SubCategory } from "../sub-category/sub-category.entity.js"

@Expose()
export class CategoryDto {
    @IsString()
    @Expose()
    name: string

    @ValidateNested()
    @Expose()
    @Type(() => SubCategory)
    subCategories: SubCategory[]
}