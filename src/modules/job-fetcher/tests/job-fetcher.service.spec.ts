import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { of, throwError } from 'rxjs';
import { JobFetcherService } from '../job-fetcher.service';
import { JobProviderRegistry } from '../providers/job-provider.registry';
import { JobOfferService } from '../../job-offers/job-offer.service';
import { JOB_PROVIDERS } from '../providers/job-providers.token';
import { JobProviderException } from '@src/common/exceptions/job-provider.exception';
import { default as jobOfferConfig } from '../../job-offers/config/job-offer.config';

// Mock classes and values
const mockJobProvider = {
  getProviderName: jest.fn().mockReturnValue('test-provider'),
  getApiUrl: jest.fn().mockReturnValue('http://test.com/api'),
  transform: jest.fn().mockReturnValue([]),
};

const mockJobOfferService = {
  saveTransformedJobs: jest
    .fn()
    .mockResolvedValue({ newJobsCount: 1, updatedJobsCount: 0 }),
};

const mockSchedulerRegistry = {
  addCronJob: jest.fn(),
  getCronJob: jest.fn().mockReturnValue({
    stop: jest.fn(),
    start: jest.fn(),
  }),
};

const mockHttpService = {
  get: jest.fn(),
};

const mockJobProviderRegistry = {
  getProviders: jest.fn().mockReturnValue([mockJobProvider]),
};

describe('JobFetcherService', () => {
  let service: JobFetcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobFetcherService,
        { provide: JobProviderRegistry, useValue: mockJobProviderRegistry },
        { provide: HttpService, useValue: mockHttpService },
        { provide: SchedulerRegistry, useValue: mockSchedulerRegistry },
        { provide: JobOfferService, useValue: mockJobOfferService },
        { provide: JOB_PROVIDERS, useValue: [mockJobProvider] },
        {
          provide: jobOfferConfig.KEY,
          useValue: {
            jobFetchInterval: '0 0 * * *',
            fetchMaxRetriesCount: 3,
            fetchInitialDelay: 1000,
          },
        },
      ],
    }).compile();

    service = module.get<JobFetcherService>(JobFetcherService);
    jest.spyOn(service['logger'], 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAndStoreJobs', () => {
    it('should fetch and store jobs successfully', async () => {
      mockHttpService.get.mockReturnValue(of({ data: {} }));
      await service.fetchAndStoreJobs();
      expect(mockJobProviderRegistry.getProviders).toHaveBeenCalled();
      expect(mockHttpService.get).toHaveBeenCalledWith('http://test.com/api');
      expect(mockJobProvider.transform).toHaveBeenCalled();
      expect(mockJobOfferService.saveTransformedJobs).toHaveBeenCalled();
    });

    it('should handle JobProviderException', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => new JobProviderException('Test error')),
      );
      await service.fetchAndStoreJobs();
      expect(service['logger'].error).toHaveBeenCalledWith(
        expect.stringContaining('JobProviderException for test-provider'),
        expect.any(String),
      );
    });

    it('should handle generic error', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => new Error('Test error')),
      );
      await service.fetchAndStoreJobs();
      expect(service['logger'].error).toHaveBeenCalledWith(
        expect.stringContaining(
          'Error fetching jobs from test-provider: Test error',
        ),
        expect.any(String),
      );
    });
  });
});
