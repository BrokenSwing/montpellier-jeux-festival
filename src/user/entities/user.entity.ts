import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export const UQ_USERNAME = 'UQ_USERNAME';

@Entity()
@Unique(UQ_USERNAME, ['username'])
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
