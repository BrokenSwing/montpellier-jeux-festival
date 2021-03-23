import { BadRequestException, Injectable } from '@nestjs/common';
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

  async generateTokens(user: { username: string, id: string }) {
    const accessTokenPayload = {
      username: user.username,
      sub: user.id,
      access_token: true,
    };
    const refreshTokenPayload = {
      sub: user.id,
      refresh_token: true,
    };
    return {
      access_token: await this.jwtService.signAsync(accessTokenPayload),
      refresh_token: await this.jwtService.signAsync(refreshTokenPayload, {
        expiresIn: '2d',
      }),
    };
  }

  async refresh(refreshToken: string) {
    const data = await this.jwtService.verifyAsync<{ sub: string, refresh_token?: boolean }>(refreshToken);
    if (data.refresh_token) {
      const user = await this.usersService.findOne(data.sub);
      if (user) {
        return await this.generateTokens(user);
      }
    }
    throw new BadRequestException('The provided token is not a refresh token');
  }
}
