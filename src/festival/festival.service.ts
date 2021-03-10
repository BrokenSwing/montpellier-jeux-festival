import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { Festival, UQ_NAME } from './entities/festival.entity';
import { hasNoFields, isConstraint } from '../utils';

/**
 * This service is responsible for managing festivals.
 */
@Injectable()
export class FestivalService {
  private readonly logger = new Logger(FestivalService.name);

  constructor(
    @InjectRepository(Festival)
    private festivalRepository: Repository<Festival>,
  ) {}

  /**
   * Creates a festival.
   *
   * @param createFestivalDto The data for the festival
   * @returns the created festival
   */
  async create(createFestivalDto: CreateFestivalDto) {
    try {
      return await this.festivalRepository.save(createFestivalDto);
    } catch (e) {
      if (isConstraint(e, UQ_NAME)) {
        throw new BadRequestException(
          'The given festival name is already used',
        );
      }
      this.logger.error(e);
      throw new InternalServerErrorException(
        'Unable to create the given festival',
      );
    }
  }

  /**
   * @returns all the festivals
   */
  findAll() {
    return this.festivalRepository.find();
  }

  /**
   * Retrieves the festival with the given id.
   *
   * @param id The id of the festival to retrieve
   * @returns the festival with the given id
   */
  async findOne(id: string) {
    const festival = await this.festivalRepository.findOne(id);
    if (festival) {
      return festival;
    }
    throw new NotFoundException(`No festival with UUID ${id} can be found`);
  }

  /**
   * Updates the festival with the given id.
   *
   * @param id The id of the festival to update
   * @param updateFestivalDto The data to update the festival
   * @returns the updated festival
   */
  async update(id: string, updateFestivalDto: UpdateFestivalDto) {
    if (hasNoFields(updateFestivalDto)) {
      return new BadRequestException('You must specify fields to update');
    }

    let result: UpdateResult;
    try {
      result = await this.festivalRepository.update(id, updateFestivalDto);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return await this.findOne(id);
  }
}
