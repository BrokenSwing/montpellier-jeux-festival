import { Module } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { FestivalController } from './festival.controller';
import { PriceService } from './price.service';
import { databaseAccessModule } from '../utils';

@Module({
  imports: [databaseAccessModule()],
  controllers: [FestivalController],
  providers: [FestivalService, PriceService],
})
export class FestivalModule {}
