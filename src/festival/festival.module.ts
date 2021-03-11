import { Module } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { FestivalController } from './festival.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Festival } from './entities/festival.entity';
import { Price } from './entities/prices.entity';
import { Area } from './entities/area.entity';
import { PriceService } from './price.service';
import { databaseAccessModule } from '../utils';

@Module({
  imports: [databaseAccessModule()],
  controllers: [FestivalController],
  providers: [FestivalService, PriceService],
})
export class FestivalModule {}
