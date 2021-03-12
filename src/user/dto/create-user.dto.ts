import { IsBoolean, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsBoolean()
    isAdmin: boolean;
}
