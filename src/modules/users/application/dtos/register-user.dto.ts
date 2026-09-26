/**
 * Register User Request Dto
 */
export type RegisterUserDto = {
    firstName: string;
    lastName: string;
    pin: string;
    email: string;
    nin?: string;
    bvn?: string;
}