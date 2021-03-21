import { ApiHideProperty } from '@nestjs/swagger';
import { Game } from 'src/game/entities/game.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  //Relations

  @ApiHideProperty()
  @OneToMany(() => Game, (game) => game.gameType)
  games: Game[];
}
