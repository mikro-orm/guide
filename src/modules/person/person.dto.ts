export interface PersonDto {
    lastName: string
    firstName: string | null
    fullNames: string[] | null
    nicknames: string[] | null
    dateOfBirth: string | null
    birthplace: string
    dateOfDeath: string | null
    description: string
    occupation: string | null
    xCoordinate: number
    yCoordinate: number
    categories: string[]
    subCategories: string[] | null
    sources: {
        sourceType: 'ELULUGU' | 'PILT' | 'RAAMAT'
        source: string
        location?: string
    }[]
}

export class PersonDtoCls {
    lastName: string
    firstName: string | null
    fullNames: string[] | null
    nicknames: string[] | null
    dateOfBirth: string | null
    birthplace: string
    dateOfDeath: string | null
    description: string
    occupation: string | null
    xCoordinate: number
    yCoordinate: number
    categories: string[]
    subCategories: string[] | null
    sources: {
        sourceType: 'ELULUGU' | 'PILT' | 'RAAMAT'
        source: string
        location?: string
    }[]
}