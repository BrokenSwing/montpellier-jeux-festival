import { IsInt, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreatePriceDto {
  @IsInt()
  tableCount: number;

  @IsInt()
  floorCount: number;

  @IsNumber()
  tablePrice: number;

  @IsNumber()
  floorPrice: number;

  @IsUUID()
  @IsNotEmpty()
  festival: string;
}
