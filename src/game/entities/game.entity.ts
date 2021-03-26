import { ApiHideProperty } from '@nestjs/swagger';
import { Company } from '../../company/entities/company.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameQuantities } from 'src/booking/entities/game-quantities.entity';

@Entity()
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

  @Column({ nullable: true, default: null })
  guideLink: string;

  // Foreign keys

  @Column()
  publisherId: string;

  @Column()
  type: string;

  // Relations

  @ApiHideProperty()
  @ManyToOne(() => Company, (publisher) => publisher.games)
  publisher: Company;

  @ApiHideProperty()
  @OneToMany(() => GameQuantities, (gameQuantities) => gameQuantities.game)
  gamesQuantities: GameQuantities[];
}
