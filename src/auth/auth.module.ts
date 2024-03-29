import { RoleService } from './role.service';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSerivce } from './user.service';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './security/passport.jwt.strategy';
import { Role } from './entity/role.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserSerivce, RoleService, JwtStrategy],
  exports: [TypeOrmModule],
})
export class AuthModule {
  constructor(
    private roleService: RoleService,
    private userService: UserSerivce,
  ) {
    this.roleService.createDefaultRole();
    this.userService.createDefaultRole();
  }
}
