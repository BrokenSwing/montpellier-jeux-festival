import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsBoolean()
  isPublisher: boolean;

  @IsBoolean()
  isExhibitor: boolean;

  @IsBoolean()
  isActive: boolean;
}
