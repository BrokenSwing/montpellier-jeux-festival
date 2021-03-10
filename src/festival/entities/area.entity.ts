import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Festival } from './festival.entity';

@Entity()
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  // Foreign keys

  @Column()
  festivalId: string;

  // Relations

  @ManyToOne(() => Festival, (festival) => festival.areas)
  festival: Festival;
}
