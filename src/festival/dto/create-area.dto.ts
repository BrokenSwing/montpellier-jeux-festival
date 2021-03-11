import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty()
  label: string;

  @IsUUID()
  @IsNotEmpty()
  festival: string;
}
