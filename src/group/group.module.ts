import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Group } from './entity/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupUserAttendanceService } from './group-user.attendance.service';
import { GroupUserAttendance } from './entity/group-user.attendance.entity';
import { UserSerivce } from 'src/auth/user.service';
import { User } from 'src/auth/entity/user.entity';
import { Role } from 'src/auth/entity/role.entity';
import { RoleService } from 'src/auth/role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupUserAttendance, User, Role]),
    GroupModule,
  ],
  controllers: [GroupController],
  providers: [
    GroupService,
    GroupUserAttendanceService,
    UserSerivce,
    RoleService,
  ],
  exports: [TypeOrmModule],
})
export class GroupModule {}
