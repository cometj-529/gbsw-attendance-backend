import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Group } from 'src/group/entity/group.entity';
import { User } from 'src/auth/entity/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class GroupUserAttendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Group)
  @Exclude()
  group: Group;

  @Column('text')
  message: string;

  @Column({ default: false })
  isAttendance: Boolean;
}
