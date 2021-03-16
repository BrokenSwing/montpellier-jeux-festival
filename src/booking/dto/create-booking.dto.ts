import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  notes: string;

  @IsBoolean()
  needVolunteers: boolean;

  @IsBoolean()
  isPresent: boolean;

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
  createdOn: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  billSentOn?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  billPaidOn?: Date;

  @IsUUID()
  @IsNotEmpty()
  festival: string;

  @IsUUID()
  @IsNotEmpty()
  company: string;
}
