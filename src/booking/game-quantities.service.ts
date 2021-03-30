import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameQuantitiesDto } from './dto/create-game-quantities.dto';
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
}
