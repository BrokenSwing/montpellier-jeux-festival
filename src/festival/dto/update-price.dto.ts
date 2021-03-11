import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePriceDto } from './create-price.dto';

export class UpdatePriceDto extends PartialType(
    OmitType(CreatePriceDto, ['festival'])
) {}
