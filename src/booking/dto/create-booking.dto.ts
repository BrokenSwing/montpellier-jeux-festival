import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  notes: string;

  @IsBoolean()
  needVolunteers: boolean;

  @IsBoolean()
  isPreset: boolean;

  @IsBoolean()
  isPlaced: boolean;

  @IsNumber()
  @Min(0)
  discount: number;

  @IsNumber()
  @Min(0)
  fees: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  billSentOn?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  billPaidOn?: Date;
}
