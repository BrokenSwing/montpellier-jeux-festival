import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  async validateUser(
    givenUsername: string,
    givenPassword: string,
  ): Promise<any> {
    const user = await this.usersService.findByUsername(givenUsername);
    if (user.length && user[0].password === givenPassword) {
      const { password, ...result } = user[0];
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
