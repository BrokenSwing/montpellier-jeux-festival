import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hasNoFields } from '../utils';
import { CreateTableQuantitiesDto } from './dto/create-table-quantities.dto';
import { UpdateTableQuantitiesDto } from './dto/update-table-quantities.dto';
import { TableQuantities } from './entities/table-quantities.entity';

/**
 * This service is responsible for creating table quantities for
 * a booking.
 */
@Injectable()
export class TableQuantitiesService {
  constructor(
    @InjectRepository(TableQuantities)
    private tableQuantitiesRepository: Repository<TableQuantities>,
  ) {}

  /**
   * Creates a table quantities.
   *
   * @param createTableQuantitiesDto The data to create the table quantities
   * @returns the created table quantities
   */
  create(createTableQuantitiesDto: CreateTableQuantitiesDto) {
    const {
      booking,
      price,
      tablesCount,
      floorsCount,
      ...dto
    } = createTableQuantitiesDto;
    return this.tableQuantitiesRepository.save({
      tables: tablesCount,
      floors: floorsCount,
      bookingId: booking,
      priceId: price,
      ...dto,
    });
  }

  async update(
    bookingId: string,
    priceId: string,
    updateTableQuantitiesDto: UpdateTableQuantitiesDto,
  ) {
    if (hasNoFields(updateTableQuantitiesDto)) {
      throw new BadRequestException(
        'You must specify at least one field to update',
      );
    }

    const result = await this.tableQuantitiesRepository.update(
      {
        bookingId,
        priceId,
      },
      {
        floors: updateTableQuantitiesDto.floorsCount,
        tables: updateTableQuantitiesDto.tablesCount,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return this.tableQuantitiesRepository.findOne({
      bookingId,
      priceId,
    });
  }

  async delete(bookingId: string, priceId: string) {
    const result = await this.tableQuantitiesRepository.delete({
      bookingId,
      priceId,
    });
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
