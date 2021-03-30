import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTableQuantitiesDto } from './dto/create-table-quantities.dto';
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
}
