import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Area } from './area.entity';
import { Price } from './prices.entity';

export const UQ_NAME = 'UQ_NAME';

@Entity()
@Unique(UQ_NAME, ['name'])
export class Festival {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  date: Date;

  @Column({ default: false })
  isActive: boolean;

  // Relations

  @OneToMany(() => Price, (price) => price.festival)
  prices: Price[];

  @OneToMany(() => Area, (area) => area.festival)
  areas: Area[];
}
