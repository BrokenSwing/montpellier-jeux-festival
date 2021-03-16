import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_SECRET } from '../config';
import { PasswordService } from '../user/password.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        signOptions: { expiresIn: '60m' },
        secret: config.get(JWT_SECRET),
      }),
    }),
    ConfigModule,
    PasswordService,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, PasswordService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
