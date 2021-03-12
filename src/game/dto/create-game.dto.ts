import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  name: string;

  @IsString()
  duration: string;

  @IsInt()
  minPlayers: number;

  @IsInt()
  maxPlayers: number;

  @IsInt()
  minAge: number;

  @IsInt()
  maxAge: number;

  @IsUUID()
  publisherId: string;
}
