import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from 'src/helpers/utils';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByEmail(username);
    if (!user) {
      return null;
    }
    const isValidPassword = await comparePasswordHelper(
      password,
      user.password,
    );
    if (!isValidPassword) {
      return null;
    }
    return user;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }
}
