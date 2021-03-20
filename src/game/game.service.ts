import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/entities/company.entity';
import { hasNoFields, isConstraint } from '../utils';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game, UQ_GAME_NAME } from './entities/game.entity';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(createGameDto: CreateGameDto) {
    let res: Company;
    try {
      res = await this.companyRepository.findOne({
        id: createGameDto.publisherId,
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
    if (res) {
      try {
        return await this.gameRepository.save(createGameDto);
      } catch (e) {
        if (isConstraint(e, UQ_GAME_NAME)) {
          throw new BadRequestException('The given game name is already used');
        }
        this.logger.error(e);
        throw new InternalServerErrorException();
      }
    }
    throw new BadRequestException(
      "This publisher id doesn't exists upon game creation",
    );
  }

  findAll() {
    return this.gameRepository.find();
  }

  async findOne(id: string) {
    const game = await this.gameRepository.findOne(id);
    if (game) {
      return game;
    }
    throw new NotFoundException(`No game with UUID ${id} can be found`);
  }

  update(id: string, updateGameDto: UpdateGameDto) {
    if (hasNoFields(updateGameDto)) {
      return new BadRequestException('You must specify fields to update');
    }
    return this.gameRepository.save({
      id: id,
      ...updateGameDto,
    });
  }

  async remove(id: string) {
    let deleteResult: DeleteResult;
    try {
      deleteResult = await this.gameRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new NotFoundException();
      }
      return { message: `The game with UUID ${id} was successfully deleted` };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }
}
