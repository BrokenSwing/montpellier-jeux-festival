import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePriceDto } from './create-price.dto';

export class UpdatePriceDto extends PartialType(
    OmitType(CreatePriceDto, ['festival'])
) {}
