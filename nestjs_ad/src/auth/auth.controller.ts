import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './Guard/local.guard';
import { JwtGuard } from './Guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @UseGuards(LocalGuard)
  handleLogin(@Request() req) {
    if (!req.user) {
      throw new BadRequestException('Error');
    }
    return this.authService.login(req.user);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
