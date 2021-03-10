import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty } from 'class-validator';

export class CreateFestivalDto {
  @IsNotEmpty()
  name: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsBoolean()
  isActive: boolean;
}
