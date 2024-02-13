import { attendanceFalseDto } from './dto/attendance.false.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from './entity/group.entity';
import { GroupUserAttendance } from './entity/group-user.attendance.entity';
import { JoinGroupDto } from './dto/join.group.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { RoleType } from 'src/auth/role-type';
import { RolesGuard } from 'src/auth/security/roles.guard';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { Request } from 'express';
import { attendanceTrueDto } from './dto/attendance.true.dto';
import { CreateGroupDto } from './dto/create.group.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly service: GroupService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @Get('/all')
  getAll(): Promise<Group[]> {
    return this.service.getAll();
  }

  @Get('/my')
  @UseGuards(AuthGuard)
  getMyGroups(@Req() req: Request): Promise<Group[]> {
    return this.service.getGroupByUser(req);
  }

  @Post('/create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  createGroup(@Body() dto: CreateGroupDto): Promise<Group> {
    return this.service.createGroup(dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/:id')
  getAttendanceByGroup(
    @Param('id') id: number,
    @Req() req: Request,
    @Query('date') date: Date,
  ): Promise<GroupUserAttendance[]> {
    return this.service.getAttendanceByGroup(id, req, date);
  }

  @Post('/join')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  joinGroup(@Body() dto: JoinGroupDto) {
    return this.service.joinGroup(dto);
  }

  @Post('/attendance')
  @UseGuards(AuthGuard)
  attendanceTrue(@Body() dto: attendanceTrueDto, @Req() req: Request) {
    return this.service.attendanceTrue(dto, req);
  }

  @Delete('/attendance')
  @UseGuards(AuthGuard)
  attendanceFalse(@Body() dto: attendanceFalseDto, @Req() req: Request) {
    return this.service.attendanceFalse(dto, req);
  }
}
