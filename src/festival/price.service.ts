import {
  BadRequestException,
  Injectable,
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
   * @param createPriceDto The data for the price category
   * @returns the created festival
   */
  create(createPriceDto: CreatePriceDto) {
    const { festival, ...dto } = createPriceDto;
    return this.priceRepository.save({
      festivalId: festival,
      ...dto,
    });
  }

  /**
   * Updates the price category with the given priceId of the festival
   * with the given festivalId.
   *
   * @param priceId The id of the price category to update
   * @param updatePriceDto The data to update the price category
   * @returns the updated price category
   */
  async update(priceId: string, updatePriceDto: UpdatePriceDto) {
    if (hasNoFields(updatePriceDto)) {
      throw new BadRequestException(
        'You must specify at least one field to update',
      );
    }

    let result = await this.priceRepository.update(priceId, updatePriceDto);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return await this.priceRepository.findOne(priceId);
  }

  /**
   * Deletes a price category.
   *
   * @param priceId The id of the price category
   * @returns an object if deletion was successful
   */
  async delete(priceId: string) {
    const result = await this.priceRepository.delete(priceId);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
