import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { JobFetcherService } from './job-fetcher.service';
import { JobProviderRegistry } from './providers/job-provider.registry';
import { JOB_PROVIDERS } from './providers/job-providers.token';
import { Provider1Service } from './providers/provider1.service';
import { Provider2Service } from './providers/provider2.service';
import { JobOfferModule } from '../job-offers/job-offer.module';
import jobOfferConfig from '../job-offers/config/job-offer.config';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    ConfigModule.forFeature(jobOfferConfig),
    JobOfferModule,
  ],
  providers: [
    JobFetcherService,
    JobProviderRegistry,
    {
      provide: JOB_PROVIDERS,
      useFactory: () => [new Provider1Service(), new Provider2Service()],
    },
  ],
})
export class JobFetcherModule {}
