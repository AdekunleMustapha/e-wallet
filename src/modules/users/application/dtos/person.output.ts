import { Person } from "../../domain/entities"
import { AddressOutput} from "./address.output"
import { GenderOutput } from "./gender.output"

export type PersonOutput = {
    id: string,
    firstName: string,
    lastName: string,
    dob: string,
    email: string,
    gender: GenderOutput,
    address: AddressOutput,
    createdAt: Date
}

export function toPersonOutput(
    person: Person,
    address: AddressOutput,
    gender: GenderOutput
): PersonOutput {
    return {
        id: person.id.value,
        firstName: person.firstName.name,
        lastName: person.lastName.name,
        dob: person.dob.toDateString(),
        email: person.email.value,
        gender,
        address,
        createdAt: person.createdAt,
    }
}