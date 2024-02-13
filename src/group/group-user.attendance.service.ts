import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { GroupUserAttendance } from './entity/group-user.attendance.entity';
import { Group } from './entity/group.entity';
import { User } from 'src/auth/entity/user.entity';

@Injectable()
export class GroupUserAttendanceService {
  constructor(
    @InjectRepository(GroupUserAttendance)
    private readonly attendanceRepository: Repository<GroupUserAttendance>,
  ) {}

  async findByOption(
    options: FindOneOptions<GroupUserAttendance>,
  ): Promise<GroupUserAttendance | undefined> {
    return await this.attendanceRepository.findOne(options);
  }

  async findByGroupAndDate(
    group: Group,
    date: Date,
  ): Promise<GroupUserAttendance[]> {
    const attendanceUsers = await this.attendanceRepository.find({
      where: { group, date },
    });

    const datas = group.users.map((user) => {
      const newUser = this.attendanceRepository.create();

      newUser.user = user;
      newUser.group = group;
      newUser.date = date;

      const attendanceUser = attendanceUsers.find(
        (_user) => _user.user.id === user.id,
      );

      newUser.isAttendance = attendanceUser
        ? attendanceUser.isAttendance
        : false;
      newUser.message = attendanceUser ? attendanceUser.message : '';

      return newUser;
    });

    return datas;
  }

  async attendanceOneByGroupAndUserAndDate(
    group: Group,
    user: User,
    date: Date,
    message: string,
  ) {
    const attendanceUser = await this.attendanceRepository.findOne({
      where: {
        group,
        user,
        date,
      },
    });

    if (!message) message = '';

    if (!attendanceUser) {
      const newUser = this.attendanceRepository.create();
      newUser.user = user;
      newUser.group = group;
      newUser.message = message;
      newUser.isAttendance = true;
      newUser.date = date;
      return await this.attendanceRepository.save(newUser);
    }

    attendanceUser.isAttendance = true;
    attendanceUser.message = message;

    return await this.attendanceRepository.save(attendanceUser);
  }

  async nonAttendanceOneByGroupAndUserAndDate(
    group: Group,
    user: User,
    date: Date,
    message: string,
  ) {
    const attendanceUser = await this.attendanceRepository.findOne({
      where: {
        group,
        user,
        date,
      },
    });

    if (!message) message = '';

    if (!attendanceUser) {
      const newUser = this.attendanceRepository.create();
      newUser.user = user;
      newUser.group = group;
      newUser.message = message;
      newUser.isAttendance = false;
      newUser.date = date;
      return await this.attendanceRepository.save(newUser);
    }

    attendanceUser.isAttendance = false;
    attendanceUser.message = message;

    return await this.attendanceRepository.save(attendanceUser);
  }
}
