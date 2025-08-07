import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobOfferModule } from './modules/job-offers/job-offer.module';
import { JobFetcherModule } from './modules/job-fetcher/job-fetcher.module';
import { WinstonModule } from 'nest-winston';
import { createWinstonLoggerConfig } from './config/winston.config';
import { I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import typeormConfig from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    WinstonModule.forRoot(createWinstonLoggerConfig()),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: ['lang'] }],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(typeormConfig)],
      inject: [typeormConfig.KEY],
      useFactory: (config: ConfigType<typeof typeormConfig>) =>
        config as TypeOrmModuleOptions,
    }),
    JobOfferModule,
    JobFetcherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
