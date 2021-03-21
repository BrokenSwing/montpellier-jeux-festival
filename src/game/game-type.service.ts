import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameTypeDto } from './dto/create-game-type.dto';
import { GameType } from './entities/game-type.entity';

@Injectable()
export class GameTypeService {
  constructor(
    @InjectRepository(GameType)
    private gameTypeRepository: Repository<GameType>,
  ) {}

  create(@Body() createGameTypeDto: CreateGameTypeDto) {
    return this.gameTypeRepository.save(createGameTypeDto);
  }

  findAll() {
    return this.gameTypeRepository.find();
  }

  async delete(id: string) {
    const result = await this.gameTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
