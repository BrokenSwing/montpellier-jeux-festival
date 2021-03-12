import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UUID } from 'src/utils';
import { CreateGameQuantitiesDto } from './dto/create-game-quantities.dto';
import { UpdateGameQuantitiesDto } from './dto/update-game-quantities.dto';
import { GameQuantitiesService } from './game-quantities.service';

@ApiTags('Game quantities')
@Controller('api/game-quantities')
export class GameQuantitiesController {
  constructor(private gameQuantitiesService: GameQuantitiesService) {}

  @Get(':id')
  findOne(@UUID('id') id: string) {
    return this.gameQuantitiesService.findOne(id);
  }

  @Post()
  create(createGameQuantitiesDto: CreateGameQuantitiesDto) {
    return this.gameQuantitiesService.create(createGameQuantitiesDto);
  }

  @Patch(':id')
  update(
    @UUID('id') id: string,
    updateGameQuantitiesDto: UpdateGameQuantitiesDto,
  ) {
    return this.gameQuantitiesService.update(id, updateGameQuantitiesDto);
  }

  @Delete(':id')
  delete(@UUID('id') id: string) {
    return this.gameQuantitiesService.delete(id);
  }
}
