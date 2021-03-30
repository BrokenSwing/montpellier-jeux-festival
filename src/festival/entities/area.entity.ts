import { ApiHideProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { GameQuantities } from '../../booking/entities/game-quantities.entity';
import { Festival } from './festival.entity';

export const UQ_AREA_LABEL = 'UQ_area_label';

@Entity()
@Unique(UQ_AREA_LABEL, ['label', 'festivalId'])
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  // Foreign keys

  @Column()
  festivalId: string;

  // Relations

  @OneToMany(() => GameQuantities, (gq) => gq.area)
  gamesQuantities: GameQuantities[];

  @ApiHideProperty()
  @ManyToOne(() => Festival, (festival) => festival.areas)
  festival: Festival;
}
