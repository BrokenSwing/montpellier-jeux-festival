import { ApiHideProperty } from '@nestjs/swagger';
import { Company } from '../../company/entities/company.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { GameType } from './game-type.entity';
export const UQ_GAME_NAME = 'UQ_GAME_NAME';

@Entity()
@Unique(UQ_GAME_NAME, ['name'])
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  duration: string;

  @Column()
  minPlayers: number;

  @Column()
  maxPlayers: number;

  @Column()
  minAge: number;

  @Column()
  maxAge: number;

  @Column({ default: false })
  isPrototype: boolean;

  @Column({ nullable: true })
  manualLink: string;

  // Foreign keys

  @Column()
  publisherId: string;

  @Column()
  gameTypeId: string;

  // Relations

  @ApiHideProperty()
  @ManyToOne(() => Company, (publisher) => publisher.games)
  publisher: Company;

  @ApiHideProperty()
  @ManyToOne(() => GameType, (gameType) => gameType.games)
  gameType: GameType;
}
