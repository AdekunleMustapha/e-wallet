import { Country } from "../../domain/entities"

export type CountryOutput = {
    id: string,
    name: string,
    code: string
}

export function toCountryOutput(country: Country) {
    return {
        id: country.id.value,
        name: country.countryName,
        code: country.countryCode
    }
}