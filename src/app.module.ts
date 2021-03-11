import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configurationModule, DATABASE_URL, PRODUCTION } from './config';
import { FestivalModule } from './festival/festival.module';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    configurationModule(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        synchronize: !config.get(PRODUCTION),
        url: config.get(DATABASE_URL),
        autoLoadEntities: true,
      }),
    }),
    FestivalModule,
    CompanyModule,
    UserModule,
    AuthModule,
    BookingModule,
    GameModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
