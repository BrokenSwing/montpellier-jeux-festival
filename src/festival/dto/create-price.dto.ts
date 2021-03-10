import { IsInt } from 'class-validator';

export class CreatePriceDto {
  @IsInt()
  tableCount: number;

  @IsInt()
  floorCount: number;

  tablePrice: number;

  floorPrice: number;
}
