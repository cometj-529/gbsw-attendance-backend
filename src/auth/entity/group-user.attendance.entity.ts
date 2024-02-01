import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Group } from 'src/group/entity/group.entity';

@Entity()
export class GroupUserAttendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  updatedAt: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Group)
  group: Group;

  @Column('text')
  message: string;

  @Column({ default: false })
  isAttendance: Boolean;
}
