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
import { Public, ResponseMessage } from 'src/decorator/customize.guard';
import { CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) { }
  @Post('login')
  @Public()
  @UseGuards(LocalGuard)
  @ResponseMessage('Login')
  handleLogin(@Request() req) {
    if (!req.user) {
      throw new BadRequestException('Error');
    }
    return this.authService.login(req.user);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Post('check-code')
  @Public()
  checkCode(@Body() registerDto: CodeAuthDto) {
    return this.authService.checkCode(registerDto);
  }

  @Post('sent-code')
  @Public()
  sentCode(@Body('_id') _id: string) {
    return this.authService.sentCode(_id);
  }

  @Get('mail')
  @Public()
  async testMail() {
    await this.mailerService.sendMail({
      to: 'trantuyenquang001@gmail.com',
      subject: 'Hello World',
      text: 'Welcome',
      template: 'register',
      context: {
        name: 'quang',
        activationCode: 123456789,
        year: '2026',
      },
    });
    return 'ok';
  }
}
