import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, UpdateResult } from 'typeorm';
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
    private connection: Connection,
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
      const res = await this.gameRepository
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

    await this.connection.transaction(async (entityManager) => {
      const festivalRepo = entityManager.getRepository(Festival);
      if (updateFestivalDto.isActive) {
        await festivalRepo.update(
          {},
          {
            isActive: false,
          },
        );
      }
      const result = await festivalRepo.update(id, updateFestivalDto);
      if (result.affected === 0) {
        throw new NotFoundException();
      }
    });

    return await this.findOne(id);
  }

  async getAccounting(id: string) {
    const r1 = await this.festivalRepository
      .createQueryBuilder('festival')
      .where('festival.id = :id', { id })
      .leftJoin('festival.prices', 'prices')
      .leftJoin('festival.bookings', 'bookings')
      .leftJoin('bookings.tablesQuantities', 'tableQ')
      .leftJoin('tableQ.price', 'price')
      .groupBy('festival.name')
      .select('festival.name', 'name')
      .addSelect(
        'COALESCE(SUM(tableQ.tables * price.tablePrice + tableQ.floors * price.floorPrice + bookings.fees - bookings.discount), 0)',
        'recipes',
      )
      .addSelect(
        `
        COALESCE(
          SUM(
            (tableQ.tables * price.tablePrice + tableQ.floors * price.floorPrice) * 
              CASE 
                WHEN bookings.billSentOn IS NULL THEN 0 
                ELSE 1
              END
          ),
          0
        )`,
        'totalSentBillsEuro',
      )
      .addSelect(
        `
        COALESCE(
          SUM(
            (tableQ.tables * price.tablePrice + tableQ.floors * price.floorPrice) * 
              CASE 
                WHEN bookings.billPaidOn IS NULL THEN 0 
                ELSE 1
              END
          ),
          0
        )`,
        'totalPaidBillsEuro',
      )
      .addSelect('COUNT(DISTINCT tableQ.bookingId)', 'totalBills')
      .addSelect(
        'COALESCE(COUNT(DISTINCT CASE WHEN bookings.billPaidOn IS NULL OR tableQ.bookingId IS NULL THEN NULL ELSE Bookings.id END), 0)',
        'totalPaidBills',
      )
      .addSelect(
        'COALESCE(COUNT(DISTINCT CASE WHEN bookings.billSentOn IS NULL OR tableQ.bookingId IS NULL THEN NULL ELSE Bookings.id END), 0)',
        'totalSentBills',
      )
      .getRawOne();

    const r2 = await this.festivalRepository
      .createQueryBuilder('festival')
      .where('festival.id = :id', { id })
      .leftJoin('festival.bookings', 'bookings')
      .leftJoin('bookings.gamesQuantities', 'gameQ')
      .select('SUM(gameQ.donation)', 'donations')
      .addSelect('SUM(gameQ.raffle)', 'raffle')
      .getRawOne();

    const r3 = await this.festivalRepository
      .createQueryBuilder('festival')
      .where('festival.id = :id', { id })
      .leftJoin('festival.bookings', 'bookings')
      .select('SUM(bookings.discount)', 'discounts')
      .addSelect('SUM(bookings.fees)', 'fees')
      .getRawOne();

    return { ...r1, ...r2, ...r3 };
  }
}
