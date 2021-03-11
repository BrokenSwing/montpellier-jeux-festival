import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsUUID()
  @IsNotEmpty()
  company: string;
}
