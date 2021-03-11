import { Module } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { FestivalController } from './festival.controller';
import { PriceService } from './price.service';
import { databaseAccessModule } from '../utils';
import { PriceController } from './price.controller';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';

@Module({
  imports: [databaseAccessModule()],
  controllers: [FestivalController, PriceController, AreaController],
  providers: [FestivalService, PriceService, AreaService],
})
export class FestivalModule {}
