import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSaveDTO } from './dto/user.save.dto';
import { Request, Response } from 'express';
import { UserLoginDto } from './dto/user.login.dto';
import { AuthGuard } from './security/auth.guard';
import { RolesGuard } from './security/roles.guard';
import { RoleType } from './role-type';
import { Roles } from './decorator/role.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Req() req: Request, @Body() dto: UserSaveDTO): Promise<any> {
    return await this.authService.saveUser(dto);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto, @Res() res: Response): Promise<any> {
    const jwt = await this.authService.validataUser(dto);
    res.setHeader('Authorization', `Bearer ${jwt.accessToken}`);
    return res.json(jwt);
  }

  @Get('/authenticate')
  @UseGuards(AuthGuard)
  isAuthenticated(@Req() req: Request): any {
    const user: any = req.user;
    return user;
  }

  @Get('/admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  adminRoleCheck(@Req() req: Request): any {
    const user: any = req.user;
    return user;
  }
}
