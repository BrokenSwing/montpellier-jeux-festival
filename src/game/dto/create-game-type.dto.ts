import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGameTypeDto {
  @IsString()
  @IsNotEmpty()
  label: string;
}
