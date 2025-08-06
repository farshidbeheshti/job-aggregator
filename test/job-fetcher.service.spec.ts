import { Test, TestingModule } from '@nestjs/testing';
import { JobFetcherService } from '../src/job-fetcher/job-fetcher.service';
import { JobOfferService } from '../src/job-offer/job-offer.service';
import { JobProviderRegistry } from '../src/job-fetcher/providers/job-provider.registry';
import { HttpService } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { JOB_PROVIDERS } from '../src/job-fetcher/providers/job-providers.token';
import {
  mockProvider1RawData,
  transformedJobOffers,
} from './mocks/job-offer.mock';
import { of } from 'rxjs';
import { Provider1Service } from '../src/job-fetcher/providers/provider1.service';
import jobOfferConfig from '../src/job-offer/config/job-offer.config';

describe('JobFetcherService', () => {
  let service: JobFetcherService;
  let jobOfferService: JobOfferService;
  let schedulerRegistry: SchedulerRegistry;
  let httpService: HttpService;
  let jobProviderRegistry: JobProviderRegistry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobFetcherService,
        {
          provide: JobOfferService,
          useValue: { saveTransformedJobs: jest.fn() },
        },
        { provide: JobProviderRegistry, useValue: { getProviders: jest.fn() } },
        { provide: HttpService, useValue: { get: jest.fn() } },
        {
          provide: SchedulerRegistry,
          useValue: {
            addCronJob: jest.fn(),
            getCronJob: jest.fn(() => ({ stop: jest.fn(), start: jest.fn() })),
          },
        },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: JOB_PROVIDERS, useValue: [new Provider1Service()] },
        {
          provide: jobOfferConfig.KEY,
          useValue: { jobFetchInterval: '*/5 * * * * *' },
        },
      ],
    }).compile();

    service = module.get<JobFetcherService>(JobFetcherService);
    jobOfferService = module.get<JobOfferService>(JobOfferService);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
    httpService = module.get<HttpService>(HttpService);
    jobProviderRegistry = module.get<JobProviderRegistry>(JobProviderRegistry);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch and store jobs', async () => {
    const provider = new Provider1Service();
    jest.spyOn(jobProviderRegistry, 'getProviders').mockReturnValue([provider]);
    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(of({ data: mockProvider1RawData }) as any);
    jest
      .spyOn(jobOfferService, 'saveTransformedJobs')
      .mockResolvedValue({ newJobsCount: 1, updatedJobsCount: 0 });
    jest
      .spyOn(schedulerRegistry, 'getCronJob')
      .mockReturnValue({ stop: jest.fn(), start: jest.fn() } as any);

    await service.fetchAndStoreJobs();

    expect(httpService.get).toHaveBeenCalledWith(provider.getApiUrl());
    expect(jobOfferService.saveTransformedJobs).toHaveBeenCalledWith(
      transformedJobOffers,
    );
  });
});
