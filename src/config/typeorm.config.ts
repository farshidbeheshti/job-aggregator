import { registerAs } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DATABSE_CONFIG } from '@src/common/constants';
import { JobOffer } from '@src/job-offer/job-offer.entity';
import { Location } from '@src/location/location.entity';
import { Skill } from '@src/skill/skill.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default registerAs(
  DATABSE_CONFIG,
  () =>
    ({
      port: +(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      type: 'postgres',
      host: process.env.DB_HOST,
      entities: [JobOffer, Location, Skill],
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }) as TypeOrmModuleAsyncOptions,
);
