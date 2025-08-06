import { WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';

export function createWinstonLoggerConfig(): WinstonModuleOptions {
  return {
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(),
        ),
      }),
      new winston.transports.File({
        filename: 'logs/application.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  };
}
