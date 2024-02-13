import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findByOption(options: FindOneOptions<Role>): Promise<Role | undefined> {
    return await this.roleRepository.findOne(options);
  }
}
