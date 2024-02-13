import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UserSaveDTO } from './dto/user.save.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from './entity/role.entity';
import { RoleService } from './role.service';

@Injectable()
export class UserSerivce {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private roleService: RoleService,
  ) {}

  async findByOption(options: FindOneOptions<User>): Promise<User | undefined> {
    return await this.userRepository.findOne(options);
  }

  async save(dto: UserSaveDTO): Promise<UserSaveDTO | undefined> {
    await this.cryptPassword(dto);

    const userRole = await this.roleService.findByOption({ where: { id: 2 } });

    const user = this.userRepository.create();

    user.userid = dto.userid;
    user.password = dto.password;
    user.username = dto.username;
    user.roles = [userRole];

    return await this.userRepository.save(user);
  }

  async cryptPassword(dto: UserSaveDTO): Promise<void> {
    dto.password = await bcrypt.hash(dto.password, await bcrypt.genSalt());

    return Promise.resolve();
  }
}
