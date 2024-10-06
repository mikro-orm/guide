import { Expose } from "class-transformer"
import { IsString } from "class-validator"

@Expose()
export class SubCategoryDto {
    @IsString()
    name: string
}