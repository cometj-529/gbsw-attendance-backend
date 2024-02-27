import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserSerivce } from './user.service';
import { UserSaveDTO } from './dto/user.save.dto';
import { UserLoginDto } from './dto/user.login.dto';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/paload.inteface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserSerivce,
    private jwtService: JwtService,
  ) {}

  async saveUser(dto: UserSaveDTO) {
    const user: User = await this.userService.findByOption({
      where: { userid: dto.userid },
    });

    if (user) {
      throw new HttpException(
        '이미 등록된 유저 아이디 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userService.save(dto);
  }

  async validataUser(
    dto: UserLoginDto,
  ): Promise<{ accessToken: string } | undefined> {
    const user: User = await this.userService.findByOption({
      where: { userid: dto.userid },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const validatePassword = await bcrypt.compare(dto.password, user.password);

    if (!validatePassword) {
      throw new UnauthorizedException();
    }

    this.convertInAuthorities(user);

    const payload: Payload = {
      id: user.id,
      userid: user.userid,
      username: user.username,
      roles: user.roles,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async tokenValidateUser(payload: Payload): Promise<User | undefined> {
    const user = await this.userService.findByOption({
      where: { id: payload.id },
    });

    this.flatAuthorities(user);

    return user;
  }

  private flatAuthorities(user: any): User {
    if (user && user.roles) {
      const roles: string[] = [];

      user.roles.forEach((role) => roles.push(role.name));
      user.roles = roles;
    }

    return user;
  }

  private convertInAuthorities(user: any): User {
    if (user && user.roles) {
      const roles: any[] = [];
      user.roles.forEach((role) => {
        roles.push({ name: role.name });
      });

      user.roles = roles;
    }

    return user;
  }
}
