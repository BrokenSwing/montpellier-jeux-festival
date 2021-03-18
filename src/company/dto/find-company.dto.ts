import { Type } from 'class-transformer';
import { IsBoolean, IsBooleanString, IsOptional } from 'class-validator';

export class FindCompanyDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  publisher?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  exhibitor?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  active?: boolean;
}
