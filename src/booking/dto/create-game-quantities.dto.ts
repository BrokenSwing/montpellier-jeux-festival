import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateGameQuantitiesDto {
  @Min(0)
  @IsInt()
  exhibitedCount: number;

  @Min(0)
  @IsInt()
  donation: number;

  @Min(0)
  @IsInt()
  raffle: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  returnedOn: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  receivedOn: Date;

  @IsBoolean()
  needsReturn: boolean;

  @Min(0)
  tablesCount: number;

  @IsUUID()
  @IsNotEmpty()
  booking: string;

  @IsUUID()
  @IsNotEmpty()
  game: string;

  @IsUUID()
  @IsOptional()
  area: string;
}
