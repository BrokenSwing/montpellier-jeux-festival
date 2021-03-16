import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { PasswordService } from '../user/password.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  async validateUser(
    givenUsername: string,
    givenPassword: string,
  ): Promise<any> {
    const user = await this.usersService.findByUsername(givenUsername);
    if (user.length) {
      const validPassword = await this.passwordService.checkPassword(
        givenPassword,
        user[0].password,
      );
      if (validPassword) {
        const { password, ...result } = user[0];
        return result;
      }
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
