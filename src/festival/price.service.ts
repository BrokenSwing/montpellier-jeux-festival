import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hasNoFields } from '../utils';
import { Repository, UpdateResult } from 'typeorm';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { Price } from './entities/prices.entity';

/**
 * This service is responsible for managing prices categories
 * for festivals.
 */
@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
  ) {}

  /**
   * Creates a category of prices for the festival with the given
   * festivalId.
   *
   * @param festivalId The id of the festival the price belongs to
   * @param createPriceDto The data for the price category
   * @returns the created festival
   */
  create(festivalId: string, createPriceDto: CreatePriceDto) {
    return this.priceRepository.save({
      festivalId,
      ...createPriceDto,
    });
  }

  /**
   * Updates the price category with the given priceId of the festival
   * with the given festivalId.
   *
   * @param festivalId The id of the festival the price category belongs to
   * @param priceId The id of the price category to update
   * @param updatePriceDto The data to update the price category
   * @returns the updated price category
   */
  async update(
    festivalId: string,
    priceId: string,
    updatePriceDto: UpdatePriceDto,
  ) {
    if (hasNoFields(updatePriceDto)) {
      throw new BadRequestException(
        'You must specify at least one field to update',
      );
    }

    let result: UpdateResult;

    try {
      result = await this.priceRepository.update(
        {
          id: priceId,
          festivalId,
        },
        updatePriceDto,
      );
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return await this.priceRepository.findOne(priceId);
  }

  /**
   * Find all price categories for the festival with the given
   * festivalId.
   *
   * @param festivalId The id of the festival
   * @returns all price categories
   */
  async findByFestival(festivalId: string) {
    const price = await this.priceRepository.find({
      where: {
        festival: {
          id: festivalId,
        },
      },
    });

    if (price) {
      return price;
    }
    throw new NotFoundException();
  }

  /**
   * Deletes a price category.
   *
   * @param festivalId The id of the festival the price category belongs to
   * @param priceId The id of the price category
   * @returns an object if deletion was successful
   */
  async delete(festivalId: string, priceId: string) {
    const result = await this.priceRepository.delete({
      id: priceId,
      festivalId,
    });
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
