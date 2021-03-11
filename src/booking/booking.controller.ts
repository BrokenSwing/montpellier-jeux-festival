import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UUID } from 'src/utils';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@UUID('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  update(@UUID('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  delete(@UUID('id') id: string) {
    return this.bookingService.delete(+id);
  }
}
