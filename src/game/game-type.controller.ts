import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUIDPipe } from 'src/utils';
import { CreateGameTypeDto } from './dto/create-game-type.dto';
import { GameTypeService } from './game-type.service';

@ApiBearerAuth()
@ApiTags('GameTypes')
@Controller('api/game-type')
export class GameTypeController {
  constructor(private readonly gameTypeService: GameTypeService) {}

  @Post()
  create(@Body() createGameTypeDto: CreateGameTypeDto) {
    return this.gameTypeService.create(createGameTypeDto);
  }

  @Get()
  findAll() {
    return this.gameTypeService.findAll();
  }

  @Delete(':id')
  delete(@Param('id', UUIDPipe) id: string) {
    return this.gameTypeService.delete(id);
  }
}
