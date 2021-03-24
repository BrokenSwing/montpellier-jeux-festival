import { ApiHideProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Festival } from './festival.entity';

export const UQ_AREA_LABEL = 'UQ_area_label';

@Entity()
@Unique(UQ_AREA_LABEL, ['label'])
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  // Foreign keys

  @Column()
  festivalId: string;

  // Relations

  @ApiHideProperty()
  @ManyToOne(() => Festival, (festival) => festival.areas)
  festival: Festival;
}
