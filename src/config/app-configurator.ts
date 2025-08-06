import { INestApplication } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { setupApp } from './app-setup.config';
import { setupSwagger } from './swagger.config';

export function configureApplication(
  app: INestApplication,
  i18nService: I18nService,
): void {
  setupApp(app, i18nService);
  setupSwagger(app);
}
