import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Group } from './entity/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupUserAttendance } from './entity/group-user.attendance.entity';
import { GroupUserAttendanceService } from './group-user.attendance.service';
import { JoinGroupDto } from './dto/join.group.dto';
import { UserSerivce } from 'src/auth/user.service';
import * as dayjs from 'dayjs';
import { Request } from 'express';
import { User } from 'src/auth/entity/user.entity';
import { RoleType } from 'src/auth/role-type';
import { attendanceTrueDto } from './dto/attendance.true.dto';
import { attendanceFalseDto } from './dto/attendance.false.dto';
import { CreateGroupDto } from './dto/create.group.dto';
dayjs.locale('ko');

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private readonly repository: Repository<Group>,
    @InjectRepository(GroupUserAttendance)
    private readonly attendanceRepository: Repository<GroupUserAttendance>,
    private attendanceService: GroupUserAttendanceService,
    private userService: UserSerivce,
  ) {}

  async getAll(): Promise<Group[] | undefined> {
    return await this.repository.find();
  }

  async getGroupByUser(req: Request): Promise<Group[] | undefined> {
    const user = req.user as User;

    if (user.roles.some((role) => String(role) === String(RoleType.ADMIN))) {
      return await this.getAll();
    }

    return await this.repository
      .createQueryBuilder('group')
      .leftJoin('group.users', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();
  }

  async createGroup(dto: CreateGroupDto): Promise<Group | undefined> {
    return await this.repository.save(dto);
  }

  async getAttendanceByGroup(
    id: number,
    req: Request,
    date: Date,
  ): Promise<GroupUserAttendance[] | undefined> {
    const selectDate = dayjs(date);

    if (isNaN(selectDate.unix())) {
      throw new BadRequestException('잘못된 입력입니다.');
    }

    const group = await this.repository.findOne({
      where: { id },
      relations: ['users'],
    });

    const user = req.user as User;

    if (
      !user ||
      (!user.roles.some((role) => role.name === RoleType.ADMIN) &&
        !group.users.some((user) => user.id === user.id))
    ) {
      throw new UnauthorizedException('잘못된 접근입니다.');
    }

    return await this.attendanceService.findByGroupAndDate(
      group,
      new Date(selectDate.format('YYYY-MM-DD')),
    );
  }

  async joinGroup(dto: JoinGroupDto) {
    const group = await this.repository.findOne({
      where: {
        id: dto.groupId,
      },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException('존재하지 않는 그룹입니다.');
    }

    const user = await this.userService.findByOption({
      where: { userid: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    if (group.users.some((_user) => _user.id === user.id)) {
      throw new BadRequestException('이미 그룹에 포함된 유저입니다.');
    }

    group.users.push(user);
    await this.repository.save(group);

    const attendance = this.attendanceRepository.create();
    attendance.group = group;
    attendance.user = user;
    attendance.date = new Date();
    attendance.message = '';
    attendance.isAttendance = false;

    await this.attendanceRepository.save(attendance);
  }

  async attendanceTrue(dto: attendanceTrueDto, req: Request) {
    const selectDate = dayjs(dto.date);

    if (isNaN(selectDate.unix())) {
      throw new BadRequestException('잘못된 입력입니다.');
    }

    const group = await this.repository.findOne({
      where: { id: dto.groupId },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException('존재하지 않는 그룹입니다.');
    }

    const user = await this.userService.findByOption({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    if (!group.users.some((_user) => _user.id === user.id)) {
      throw new BadRequestException('존재하지 않는 유저입니다.');
    }

    const reqUser = req.user as User;

    if (
      !reqUser.roles.some(
        (role) => (role as unknown as string) === RoleType.ADMIN,
      ) &&
      user.id !== reqUser.id
    ) {
      throw new UnauthorizedException('잘못된 접근입니다.');
    }

    await this.attendanceService.attendanceOneByGroupAndUserAndDate(
      group,
      user,
      new Date(selectDate.format('YYYY-MM-DD')),
      dto.message,
    );
  }

  async attendanceFalse(dto: attendanceFalseDto, req: Request) {
    const selectDate = dayjs(dto.date);

    if (isNaN(selectDate.unix())) {
      throw new BadRequestException('잘못된 입력입니다.');
    }

    const group = await this.repository.findOne({
      where: { id: dto.groupId },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException('존재하지 않는 그룹입니다.');
    }

    const user = await this.userService.findByOption({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    if (!group.users.some((_user) => _user.id === user.id)) {
      throw new BadRequestException('존재하지 않는 유저입니다.');
    }

    const reqUser = req.user as User;

    if (
      !reqUser.roles.some(
        (role) => (role as unknown as string) === RoleType.ADMIN,
      ) &&
      user.id !== reqUser.id
    ) {
      throw new UnauthorizedException('잘못된 접근입니다.');
    }

    await this.attendanceService.nonAttendanceOneByGroupAndUserAndDate(
      group,
      user,
      new Date(selectDate.format('YYYY-MM-DD')),
      dto.message,
    );
  }
}
