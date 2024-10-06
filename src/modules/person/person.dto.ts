export interface PersonDto {
    lastName: string
    firstName: string | null
    nicknames: string[] | null
    dateOfBirth: string | null
    birthplace: string
    dateOfDeath: string | null
    description: string
    xCoordinate: number
    yCoordinate: number
    categories: string[]
    subCategories: string[] | null
    sources: {
        sourceType: 'ELULUGU' | 'PILT' | 'RAAMAT'
        source: string
    }[]
}