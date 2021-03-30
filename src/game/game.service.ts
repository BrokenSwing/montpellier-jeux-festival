import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/entities/company.entity';
import { hasNoFields } from '../utils';
import { DeleteResult, Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

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
        const res = await this.gameRepository.save(createGameDto);
        return await this.findOne(res.id);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
    throw new BadRequestException(
      "This publisher id doesn't exists upon game creation",
    );
  }

  findAll() {
    return this.gameRepository.find({
      relations: ['publisher'],
    });
  }

  findAllGameTypes() {
    return this.gameRepository
      .createQueryBuilder()
      .select('type')
      .distinct(true)
      .getRawMany();
  }

  async findOne(id: string) {
    const game = await this.gameRepository.findOne(id, {
      relations: ['publisher'],
    });
    if (game) {
      return game;
    }
    throw new NotFoundException(`No game with UUID ${id} can be found`);
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    if (hasNoFields(updateGameDto)) {
      return new BadRequestException('You must specify fields to update');
    }
    const res = await this.gameRepository.save({
      id: id,
      ...updateGameDto,
    });
    return await this.findOne(res.id);
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
