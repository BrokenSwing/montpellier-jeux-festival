import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateGameQuantitiesDto } from './create-game-quantities.dto';

export class UpdateGameQuantitiesDto extends PartialType(
  OmitType(CreateGameQuantitiesDto, ['booking', 'game']),
) {}
