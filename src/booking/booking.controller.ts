import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UUIDPipe } from 'src/utils';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('Bookings')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get(':id')
  findOne(@Param('id', UUIDPipe) id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', UUIDPipe) id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  delete(@Param('id', UUIDPipe) id: string) {
    return this.bookingService.delete(id);
  }
}
