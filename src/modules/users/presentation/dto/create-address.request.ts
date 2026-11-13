import { IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MaxLength } from "class-validator";

export class CreateAddressRequest {
    @IsUUID()
    @IsNotEmpty()
    countryId!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    state!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    city!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    streetName!: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{5,9}$/, { message: 'postalCode must be between 5 to 9 digits' })
    postalCode?: string;

    @IsOptional()
    @IsString()
    @Matches(/^[A-Za-z0-9-]{1,10}$/, { message: 'buildingCode must be between 1 to 10 alphanumeric characters or hyphens' })
    buildingCode?: string;

    @IsOptional()
    @IsString()
    @Matches(/^[A-Za-z0-9-]{1,10}$/, { message: 'flatCode must be between 1 to 10 alphanumeric characters or hyphens' })
    flatCode?: string;
}
