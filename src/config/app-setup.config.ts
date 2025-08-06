import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { I18nService, I18nValidationExceptionFilter } from 'nestjs-i18n';
import { AllExceptionsFilter } from '../common/filters/http-exception.filter';

export function setupApp(
  app: INestApplication,
  i18nService: I18nService,
): void {
  app.setGlobalPrefix('api');

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new AllExceptionsFilter(i18nService, httpAdapterHost),
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
}
