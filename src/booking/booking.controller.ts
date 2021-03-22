import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UUIDPipe } from '../utils';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiBearerAuth()
@ApiTags('Bookings')
@UseGuards(JwtAuthGuard)
@Controller('api/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  /**
   * Allows to list all bookings from festival.
   */
  @Get('/festival/:id')
  findAll(@Param('id', UUIDPipe) id: string) {
    return this.bookingService.findAllForFestival(id);
  }

  @Get(':id')
  findOne(@Param('id', UUIDPipe) id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', UUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  delete(@Param('id', UUIDPipe) id: string) {
    return this.bookingService.delete(id);
  }
}
