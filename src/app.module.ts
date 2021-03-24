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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'dist', 'spa'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
