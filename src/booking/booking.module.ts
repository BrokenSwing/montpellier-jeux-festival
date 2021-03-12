import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { databaseAccessModule } from 'src/utils';
import { GameQuantitiesService } from './game-quantities.service';
import { GameQuantitiesController } from './game-quantities.controller';
import { TableQuantitiesController } from './table-quantities.controller';
import { TableQuantitiesService } from './table-quantities.service';

@Module({
  imports: [databaseAccessModule()],
  controllers: [
    BookingController,
    GameQuantitiesController,
    TableQuantitiesController,
  ],
  providers: [BookingService, GameQuantitiesService, TableQuantitiesService],
})
export class BookingModule {}
