import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateTableQuantitiesDto {
  @IsNumber()
  @Min(0)
  tablesCount: number;

  @IsNumber()
  @Min(0)
  floorsCount: number;

  @IsUUID()
  @IsNotEmpty()
  price: string;

  @IsUUID()
  @IsNotEmpty()
  booking: string;
}
