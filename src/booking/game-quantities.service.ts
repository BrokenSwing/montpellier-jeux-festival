import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hasNoFields } from '../utils';
import { CreateGameQuantitiesDto } from './dto/create-game-quantities.dto';
import { UpdateGameQuantitiesDto } from './dto/update-game-quantities.dto';
import { GameQuantities } from './entities/game-quantities.entity';

/**
 * This service is responsible for managing game quantities
 * of a booking.
 */
@Injectable()
export class GameQuantitiesService {
  constructor(
    @InjectRepository(GameQuantities)
    private gameQuantitiesRepository: Repository<GameQuantities>,
  ) {}

  /**
   * Creates a game quantities.
   *
   * @param createGameQuantitiesDto The data to create the game quantities
   * @returns the create game quantities
   */
  create(createGameQuantitiesDto: CreateGameQuantitiesDto) {
    const { booking, area, game, ...dto } = createGameQuantitiesDto;
    return this.gameQuantitiesRepository.save({
      bookingId: booking,
      gameId: game,
      areaId: area,
      ...dto,
    });
  }

  async update(
    bookingId: string,
    gameId: string,
    updateGameQuantitiesDto: UpdateGameQuantitiesDto,
  ) {
    if (hasNoFields(updateGameQuantitiesDto)) {
      throw new BadRequestException(
        'You must specify at least one field to update',
      );
    }
    const { area, ...dto } = updateGameQuantitiesDto;
    const result = await this.gameQuantitiesRepository.update(
      {
        bookingId,
        gameId,
      },
      {
        ...dto,
        areaId: area,
      },
    );
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return this.gameQuantitiesRepository.findOne({
      bookingId,
      gameId,
    });
  }

  async delete(bookingId: string, gameId: string) {
    const result = await this.gameQuantitiesRepository.delete({
      bookingId,
      gameId,
    });
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
