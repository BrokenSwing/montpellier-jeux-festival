import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  name: string;

  @IsString()
  duration: string;

  @IsInt()
  players: number;

  @IsInt()
  minAge: number;

  @IsInt()
  maxAge: number;

  @IsUUID()
  publisherId: string;
}
