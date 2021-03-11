import { IsBoolean, IsNotEmpty, MaxLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsBoolean()
    isAdmin: boolean;
}
