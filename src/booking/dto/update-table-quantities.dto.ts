import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTableQuantitiesDto } from './create-table-quantities.dto';

export class UpdateTableQuantitiesDto extends PartialType(
  OmitType(CreateTableQuantitiesDto, ['booking', 'price']),
) {}
