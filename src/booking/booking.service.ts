import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hasNoFields, isForeignKeyError } from '../utils';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

/**
 * This service is responsible for managing bookings of a festival
 */
@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
  ) {}

  /**
   * Creates a booking.
   *
   * @param createBookingDto The data to create the booking
   * @returns the created booking
   */
  async create(createBookingDto: CreateBookingDto) {
    const { festival, company, ...dto } = createBookingDto;
    let result: Booking;
    try {
      result = await this.bookingRepository.save({
        ...dto,
        festivalId: festival,
        companyId: company,
      });
    } catch (e) {
      if (isForeignKeyError(e)) {
        throw new BadRequestException(
          'Either one of or both of given values for `festival` and `company` are invalid.',
        );
      }
      throw e;
    }
    return this.findOne(result.id);
  }

  /**
   * Retrieves all the bookings that are related to the festival with the
   * given id.
   *
   * @param festivalId The id of the festivcal to find bookings for
   * @returns an array of bookings
   */
  findAllForFestival(festivalId: string) {
    return this.bookingRepository.find({
      where: {
        festivalId,
      },
      relations: ['tablesQuantities', 'gamesQuantities', 'company'],
    });
  }

  /**
   * Retrieves a booking from it's id.
   * It no booking with the given uid was found, it throws a NotFoundException.
   *
   * @param id The id of the booking to retrieve
   * @returns a booking
   */
  async findOne(id: string) {
    const booking = await this.bookingRepository.findOne(id, {
      relations: ['tablesQuantities', 'gamesQuantities', 'company'],
    });
    if (booking) {
      return booking;
    }
    throw new NotFoundException();
  }

  /**
   * Updates the booking with the given id.
   * It throws a NotFoundException if no booking with the given id was found.
   * It throws a BadRequestException if no fields to update were given.
   *
   * @param id The id of the booking to update
   * @param updateBookingDto The data to update the booking
   * @returns the updated booking
   */
  async update(id: string, updateBookingDto: UpdateBookingDto) {
    if (hasNoFields(updateBookingDto)) {
      throw new BadRequestException('You must specify at least one field');
    }
    const result = await this.bookingRepository.update(id, updateBookingDto);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return this.findOne(id);
  }

  /**
   * Deletes the booking with the given id.
   * If no booking with the given id was found, a NotFoundException is thrown.
   *
   * @param id The id of the booking to delete
   * @returns an object telling the object got deleted
   */
  async delete(id: string) {
    const result = await this.bookingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
