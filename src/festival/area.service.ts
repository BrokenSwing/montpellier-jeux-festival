import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hasNoFields } from '../utils';
import { Repository } from 'typeorm';
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

  async findOne(id: string) {
    const area = await this.areaRepository.findOne(id);
    if (area) {
      return area;
    }
    throw new NotFoundException(`No area with UUID ${id} can be found`);
  }

  /**
   * Creates an area for a festival.
   *
   * @param createAreaDto The data for the area
   * @returns the created area
   */
  create(createAreaDto: CreateAreaDto) {
    const { festival, ...dto } = createAreaDto;
    return this.areaRepository.save({
      festivalId: festival,
      ...dto,
    });
  }

  /**
   * Updates an area.
   *
   * @param areaId The id of the area to update
   * @param updateAreaDto The data to update
   * @returns the updated area
   */
  async update(areaId: string, updateAreaDto: UpdateAreaDto) {
    if (hasNoFields(updateAreaDto)) {
      throw new BadRequestException(
        'You must specify at least one field to update',
      );
    }

    const result = await this.areaRepository.update(areaId, updateAreaDto);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return await this.areaRepository.findOne(areaId);
  }

  /**
   * Deletes an area.
   *
   * @param areaId The id of the area to delete
   * @returns
   */
  async delete(areaId: string) {
    const result = await this.areaRepository.delete(areaId);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
