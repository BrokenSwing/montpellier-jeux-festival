import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Request as Req } from 'express';
import { User } from '../user/entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: Req & { user: User }) {
    return this.authService.login(req.user);
  }
}
