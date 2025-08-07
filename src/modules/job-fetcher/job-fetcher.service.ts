import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { timer, lastValueFrom } from 'rxjs';
import { retry } from 'rxjs/operators';
import { JobProviderException } from '@src/common/exceptions/';
import { ITransformedJobOffer } from '../job-offers/interfaces/';
import * as configuration from '@nestjs/config';
import { CronJob } from 'cron';
import { IJobProvider } from '@src/common/interfaces/';
import { JobProviderRegistry } from './providers/';
import { JOB_PROVIDERS } from './providers/';
import { BaseJobProvider } from '@src/common/types/';
import { JobOfferService } from '../job-offers/';
import { FETCH_JOB_SCHEDULER_NAME } from '../job-offers/constants';
import { default as jobOfferConfig } from '../job-offers/config/job-offer.config';

@Injectable()
export class JobFetcherService implements OnModuleInit {
  private readonly logger = new Logger(JobFetcherService.name);

  constructor(
    private readonly jobProviderRegistry: JobProviderRegistry,
    private readonly httpService: HttpService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly jobOfferService: JobOfferService,
    @Inject(JOB_PROVIDERS) private readonly jobProviders: BaseJobProvider[],
    @Inject(jobOfferConfig.KEY)
    private readonly config: configuration.ConfigType<typeof jobOfferConfig>,
  ) {}

  onModuleInit() {
    this.initializeSchedulers();
  }

  initializeSchedulers() {
    const fetchJob = new CronJob(this.config.jobFetchInterval, () => {
      this.logger.log(
        `Job fetch cron schedule: ${this.config.jobFetchInterval}`,
      );
      return this.fetchAndStoreJobs();
    });
    this.schedulerRegistry.addCronJob(FETCH_JOB_SCHEDULER_NAME, fetchJob);
    fetchJob.start();
  }

  async fetchAndStoreJobs() {
    const job = this.schedulerRegistry.getCronJob(FETCH_JOB_SCHEDULER_NAME);
    try {
      this.logger.log('Starting job fetch and store process...', Date.now);
      await job.stop();
      this.logger.log('fetchJob stopped to prevent overlap.');

      const providers = this.jobProviderRegistry.getProviders();

      for (const provider of providers) {
        await this._processProviderJobs(provider);
      }
      this.logger.log('Job fetch and store process completed.');
    } catch {
      this.logger.error(
        `Error fetching and store jobs; It is going to be started again. `,
      );
    } finally {
      job.start();
      this.logger.log('fetchJob started again.');
    }
  }

  private async _processProviderJobs(provider: IJobProvider): Promise<void> {
    try {
      this.logger.log(`Fetching jobs from ${provider.getProviderName()}...`);
      const rawDataResponse = await this._fetchRawData(provider);

      const jobs: ITransformedJobOffer[] = provider.transform(
        rawDataResponse.data,
      );
      const { newJobsCount, updatedJobsCount } =
        await this.jobOfferService.saveTransformedJobs(jobs);

      this.logger.log(
        `Finished fetching from ${provider.getProviderName()}. Added ${newJobsCount} new jobs, updated ${updatedJobsCount} jobs.`,
      );
    } catch (error: unknown) {
      if (error instanceof JobProviderException) {
        this.logger.error(
          `JobProviderException for ${provider.getProviderName()}: ${error.message}`,
          error.stack,
        );
      } else if (error instanceof Error) {
        this.logger.error(
          `Error fetching jobs from ${provider.getProviderName()}: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `Unknown error fetching jobs from ${provider.getProviderName()}: ${JSON.stringify(error)}`,
        );
      }
    }
  }

  private async _fetchRawData(
    provider: IJobProvider,
  ): Promise<AxiosResponse<any>> {
    return lastValueFrom(
      this.httpService.get(provider.getApiUrl()).pipe(
        retry({
          count: this.config.fetchMaxRetriesCount,
          delay: (error, retryCount) => {
            const delayTime =
              this.config.fetchInitialDelay * Math.pow(2, retryCount - 1);
            this.logger.warn(
              `Retry attempt #${retryCount} for ${provider.getProviderName()}. Retrying in ${delayTime}ms. Error: ${(error as Error).message}`,
            );
            return timer(delayTime);
          },
        }),
      ),
    );
  }
}
