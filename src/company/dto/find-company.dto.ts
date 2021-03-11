import { IsBoolean, IsOptional } from 'class-validator';

export class FindCompanyDto {
  @IsOptional()
  @IsBoolean()
  publisher?: boolean;

  @IsOptional()
  @IsBoolean()
  exhibitor?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
