import { IsNotEmpty } from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty()
  label: string;
}
