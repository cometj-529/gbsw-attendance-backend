import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userid: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable()
  roles: Role[];
}
