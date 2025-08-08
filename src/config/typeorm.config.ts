import { registerAs } from '@nestjs/config';
import { DATABSE_CONFIG } from '@src/common/constants';
import { JobOffer } from '@src/modules/job-offers';
import { Location } from '@src/modules/locations';
import { Skill } from '@src/modules/skills';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default registerAs(DATABSE_CONFIG, () => ({
  type: 'postgres',
  host: process.env.NODE_ENV === 'test' ? 'localhost' : process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [JobOffer, Location, Skill],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
}));
