import { City } from "../../domain/entities";

export type CityOutput = {
    id: string,
    city: string,
    state: string,
    country: string
}

export function toCityOutput(city: City): CityOutput {
    return {
        id: city.id.value,
        city: city.city.name,
        state: city.state,
        country: city.country 
    }
}