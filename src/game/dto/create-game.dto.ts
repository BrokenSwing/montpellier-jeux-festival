import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsInt()
  minPlayers: number;

  @IsInt()
  maxPlayers: number;

  @IsInt()
  minAge: number;

  @IsInt()
  maxAge: number;

  @IsBoolean()
  isPrototype: boolean;

  @IsUUID()
  publisherId: string;

  @IsUUID()
  gameTypeId: string;
}
