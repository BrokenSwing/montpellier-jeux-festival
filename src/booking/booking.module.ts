import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { databaseAccessModule } from 'src/utils';

@Module({
  imports: [databaseAccessModule()],
  controllers: [BookingController],
  providers: [BookingService]
})
export class BookingModule {}
