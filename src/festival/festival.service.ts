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
import { Game } from 'src/game/entities/game.entity';
import { TableQuantities } from 'src/booking/entities/table-quantities.entity';

/**
 * This service is responsible for managing festivals.
 */
@Injectable()
export class FestivalService {
  private readonly logger = new Logger(FestivalService.name);

  constructor(
    @InjectRepository(Festival)
    private festivalRepository: Repository<Festival>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(TableQuantities)
    private tablesQuantitiesRepository: Repository<TableQuantities>,
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
    return this.festivalRepository.find({
      order: {
        date: 'DESC',
      },
      relations: ['prices', 'areas'],
    });
  }

  /**
   * @returns the data of the ongoing festival
   */
  async findCurrent() {
    const currentFestival = await this.festivalRepository.findOne({
      where: {
        isActive: true,
      },
    });
    if (currentFestival) {
      let res = await this.gameRepository
        .createQueryBuilder('game')
        .leftJoin('game.publisher', 'publisher')
        .leftJoin('game.gamesQuantities', 'gq')
        .leftJoin('gq.area', 'area')
        .leftJoin('area.festival', 'festival')
        .where('festival.isActive = true')
        .addSelect('publisher.name')
        .addSelect('area.label')
        .getRawMany();
      return {
        name: currentFestival.name,
        date: currentFestival.date,
        games: res,
      };
    } else {
      throw new NotFoundException();
    }
  }

  /**
   * Retrieves the festival with the given id.
   *
   * @param id The id of the festival to retrieve
   * @returns the festival with the given id
   */
  async findOne(id: string) {
    const festival = await this.festivalRepository.findOne(id, {
      relations: ['prices', 'areas'],
    });
    if (festival) {
      return festival;
    }
    throw new NotFoundException(`No festival with UUID ${id} can be found`);
  }

  /**
   * Summarize the festival with the given id.
   *
   * @param id The id of the festival to retrieve
   * @returns tables and floors quantities grouped by price's id
   */
  summarize(id: string) {
    return this.tablesQuantitiesRepository
      .createQueryBuilder('table_quantities')
      .select('SUM (table_quantities.floors)', 'floors')
      .addSelect('SUM (table_quantities.tables)', 'tables')
      .addSelect('prices.id')
      .addSelect('prices.label')
      .leftJoin('table_quantities.price', 'prices')
      .where('prices.festivalId = :id', {
        id,
      })
      .groupBy('prices.id')
      .addGroupBy('prices.label')
      .getRawMany();
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
      throw new BadRequestException('You must specify fields to update');
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
