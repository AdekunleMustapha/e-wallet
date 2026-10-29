import { Address } from "../../domain/entities"
import { CountryOutput } from "./country.output"

export type AddressOutput = {
    id: string,
    country: CountryOutput,
    state: string,
    city: string,
    streetName: string,
    postalCode: string | undefined,
    buildingCode: string | undefined,
    flatCode: string | undefined
}

export function toAddressOutput(address: Address, country: CountryOutput): AddressOutput {
    return {
        id: address.id.value,
        country,
        state: address.state,
        city: address.city,
        streetName: address.streetName,
        postalCode: address.postalCode,
        buildingCode: address.buildingCode,
        flatCode: address.flatCode
    }
}