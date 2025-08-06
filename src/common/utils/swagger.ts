import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function useSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Job Offer Aggregator API')
    .setDescription('API for aggregating job offers from various providers.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
