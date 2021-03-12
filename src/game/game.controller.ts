import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { UUID } from 'src/utils';

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
  findOneGame(@UUID('id') id: string) {
    return this.gameService.findOne(id);
  }

  @Patch(':id')
  updateGame(@UUID('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(id, updateGameDto);
  }

  @Delete(':id')
  deleteGame(@UUID('id') id: string) {
    return this.gameService.remove(id);
  }
}
