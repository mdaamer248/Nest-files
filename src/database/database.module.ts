import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        // host: configService.get<string>('DATABASE_HOST'),
        // port: configService.get<number>('DATABASE_PORT'),
        // username: configService.get<string>('DATABASE_USERNAME'),
        // password: configService.get<string>('DATABASE_PASSWORD'),
        // database: configService.get<string>('DATABASE_NAME'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        url: configService.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
        // synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
