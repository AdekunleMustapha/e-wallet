import { Gender } from "../../domain/entities"

export type GenderOutput = {
    id: string,
    genderName: string
}

export function toGenderOutput(gender: Gender): GenderOutput {
    return {
        id: gender.id.value,
        genderName: gender.genderName
    }
}