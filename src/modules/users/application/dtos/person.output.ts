import { Person } from "../../domain/entities";
import { Country, Gender, Tier } from "../../domain/enums";

export type PersonOutput = {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dob: string;
    email: string;
    phoneNumber: string;
    gender: Gender;
    country: Country;
    state: string;
    city: string;
    addressLine1: string;
    postalCode?: string;
    tier: Tier;
    createdAt: Date;
    updatedAt: Date;
};

export function toPersonOutput(person: Person): PersonOutput {
    return {
        id: person.id.value,
        firstName: person.firstName.name,
        lastName: person.lastName.name,
        middleName: person.middleName?.name,
        dob: person.dob.toDateString(),
        email: person.email.value,
        phoneNumber: person.phoneNumber.value,
        gender: person.gender,
        country: person.country,
        state: person.state,
        city: person.city,
        addressLine1: person.addressLine1,
        postalCode: person.postalCode,
        tier: person.tier,
        createdAt: person.createdAt,
        updatedAt: person.updatedAt,
    };
}
