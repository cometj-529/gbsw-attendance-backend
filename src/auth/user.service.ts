import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UserSaveDTO } from './dto/user.save.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSerivce {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByOption(options: FindOneOptions<User>): Promise<User | undefined> {
    return await this.userRepository.findOne(options);
  }

  async save(userSaveDTO: UserSaveDTO): Promise<UserSaveDTO | undefined> {
    await this.cryptPassword(userSaveDTO);
    return await this.userRepository.save(userSaveDTO);
  }

  async cryptPassword(dto: UserSaveDTO): Promise<void> {
    dto.password = await bcrypt.hash(dto.password, await bcrypt.genSalt());

    return Promise.resolve();
  }
}
