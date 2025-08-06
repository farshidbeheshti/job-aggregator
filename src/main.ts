import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { createWinstonLoggerConfig } from './config/winston.config';
import { I18nService } from 'nestjs-i18n';
import { setupSwagger } from './config/swagger.config';
import { setupApp } from './config/app-setup.config';

async function bootstrap(): Promise<void> {
  const logger = WinstonModule.createLogger(createWinstonLoggerConfig());
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  logger.log('Application is starting...');

  const i18nService =
    app.get<I18nService<Record<string, unknown>>>(I18nService);

  setupApp(app, i18nService);
  setupSwagger(app);

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);

  logger.log(i18nService.t('app.up', { args: { port: PORT }, lang: 'en' }));
}
void bootstrap();
