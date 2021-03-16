import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hasNoFields } from '../utils';
import { Repository } from 'typeorm';
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
    return this.gameQuantitiesRepository.create({
      bookingId: booking,
      gameId: game,
      areaId: area,
      ...dto,
    });
  }

  /**
   * Retrieve the game quantities with the given id.
   * It throws a NotFoundException if no game quantities with the given
   * id was found.
   *
   * @param id The id of the game quantities to retrieve
   * @returns a game quanttities
   */
  async findOne(id: string) {
    const quantities = await this.gameQuantitiesRepository.findOne(id);
    if (quantities) {
      return quantities;
    }
    throw new NotFoundException();
  }

  /**
   * Updates the game quantities with the given id. It updates the fields provided in the DTO.
   * If no game quantities with the given id was found, it throws a NotFoundException.
   * If the set of fields to update is empty, it throws a BadRequestException.
   *
   * @param id The id of the game quantities to update
   * @param updateGameQuantitiesDto The data to update
   * @returns the updated game quantities
   */
  async update(id: string, updateGameQuantitiesDto: UpdateGameQuantitiesDto) {
    if (hasNoFields(updateGameQuantitiesDto)) {
      throw new BadRequestException('You must specify at least one field');
    }

    const { area, ...dto } = updateGameQuantitiesDto;
    const result = await this.gameQuantitiesRepository.update(id, {
      areaId: area,
      ...dto,
    });
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return this.findOne(id);
  }

  /**
   * Deletes a game quantities.
   *
   * @param id The id of the game quantities to delete
   * @returns an object indicating the record was deleted
   */
  async delete(id: string) {
    const result = await this.gameQuantitiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
