import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export const UQ_NAME = 'UQ_USERNAME';

@Entity()
@Unique(UQ_NAME, ['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  isAdmin: boolean;
}
