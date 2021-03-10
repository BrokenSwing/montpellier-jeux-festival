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
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';

/**
 * This services is responsible for managing areas
 * of a festival.
 */
@Injectable()
export class AreaService {
  private readonly logger = new Logger(AreaService.name);

  constructor(
    @InjectRepository(Area)
    private areaRepository: Repository<Area>,
  ) {}

  /**
   * Creates an area for the festival with the given id.
   *
   * @param festivalId The id of the festival the area belongs to
   * @param createAreaDto The data for the area
   * @returns the created area
   */
  create(festivalId: string, createAreaDto: CreateAreaDto) {
    return this.areaRepository.save({
      festivalId,
      ...createAreaDto,
    });
  }

  /**
   * Updates an area.
   *
   * @param festivalId The id of the festival the area belongs to
   * @param areaId The id of the area to update
   * @param updateAreaDto The data to update
   * @returns the updated area
   */
  async update(
    festivalId: string,
    areaId: string,
    updateAreaDto: UpdateAreaDto,
  ) {
    if (hasNoFields(updateAreaDto)) {
      throw new BadRequestException(
        'You must specify at least one field to update',
      );
    }

    let result: UpdateResult;
    try {
      result = await this.areaRepository.update(
        {
          id: areaId,
          festivalId,
        },
        updateAreaDto,
      );
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return await this.areaRepository.findOne(areaId);
  }

  /**
   * Find all areas of a the festival with the given id.
   *
   * @param festivalId The id of the festival to find areas of
   * @returns all areas of the festival
   */
  findAllForFestival(festivalId: string) {
    return this.areaRepository.find({
      where: {
        festivalId,
      },
    });
  }

  /**
   * Deletes an area.
   *
   * @param festivalId The id of the festival the area belongs to
   * @param areaId The id of the area to delete
   * @returns
   */
  async delete(festivalId: string, areaId: string) {
    const result = await this.areaRepository.delete({
      festivalId,
      id: areaId,
    });
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
