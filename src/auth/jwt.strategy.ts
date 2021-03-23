import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_SECRET } from '../config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(JWT_SECRET)
    jwtSecret: string,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: any) {
    if (payload.sub && payload.access_token) {
      const user = await this.userRepository.findOne(payload.sub);
      if (user) {
        const { password, ...userData } = user;
        return userData;
      }
    }
    throw new UnauthorizedException();
  }
}
