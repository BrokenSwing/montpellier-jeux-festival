import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hasNoFields } from '../utils';
import { Repository } from 'typeorm';
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

  /**
   * Finds a table quantities from its id.
   *
   * @param id The id of the table quantities to find
   * @returns the table quantities
   */
  findOne(id: string) {
    return this.tableQuantitiesRepository.findOne(id);
  }

  /**
   * Updates the table quantities with the given id.
   * Throws a NotFoundException if no table quantities wuth the given id was found.
   * Throws a BadRequestException if an empty set of data to update were given.
   *
   * @param id The id of the table quantities to update
   * @param updateTableQuantitiesDto The data to update the table quantities
   * @returns the updated table quantities
   */
  async update(id: string, updateTableQuantitiesDto: UpdateTableQuantitiesDto) {
    if (hasNoFields(updateTableQuantitiesDto)) {
      throw new BadRequestException('You must specify at least one field');
    }
    const { tablesCount, floorsCount, ...dto } = updateTableQuantitiesDto;
    const result = await this.tableQuantitiesRepository.update(id, {
      tables: tablesCount,
      floors: floorsCount,
      ...dto,
    });
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return this.findOne(id);
  }

  /**
   * Deletes the table quantities with the given id.
   * Throws a NotFoundException if not table quantities with the given id was found.
   *
   * @param id The id of the table quantities to delete
   * @returns an object indicating the record was deleted
   */
  async delete(id: string) {
    const result = await this.tableQuantitiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
