import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { UUIDPipe } from 'src/utils';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Games')
@Controller('api/game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Get()
  findAllGames() {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOneGame(@Param('id', UUIDPipe) id: string) {
    return this.gameService.findOne(id);
  }

  @Patch(':id')
  updateGame(@Param('id', UUIDPipe) id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(id, updateGameDto);
  }

  @Delete(':id')
  deleteGame(@Param('id', UUIDPipe) id: string) {
    return this.gameService.remove(id);
  }
}
