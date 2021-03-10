import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Festival } from './festival.entity';

@Entity()
export class Price {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @Column('int')
  tableCount: number;

  @Column('int')
  floorCount: number;

  @Column('float')
  tablePrice: number;

  @Column('float')
  floorPrice: number;

  // Foreign keys

  @Column()
  festivalId: string;

  // Relations

  @ManyToOne(() => Festival, (festival) => festival.prices)
  festival: Festival;
}
