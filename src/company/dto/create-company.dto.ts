import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsBoolean()
  isPublisher: boolean;

  @IsBoolean()
  isExhibitor: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
