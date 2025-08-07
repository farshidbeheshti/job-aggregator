import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import { JobFetcherService } from '../job-fetcher.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('JobFetcherModule (e2e)', () => {
  let app: INestApplication;
  let jobFetcherService: JobFetcherService;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jobFetcherService = moduleFixture.get<JobFetcherService>(JobFetcherService);
    httpService = moduleFixture.get<HttpService>(HttpService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should fetch and store jobs, logging the process', async () => {
    const provider1Jobs = {
      jobs: [
        {
          jobId: '1',
          title: 'Software Engineer',
          company: { name: 'Provider1 Inc.' },
          details: {
            salaryRange: '100-150',
            location: 'New York, NY',
            type: 'Full-time',
          },
          skills: ['TypeScript', 'Node.js'],
          postedDate: new Date(),
        },
      ],
    };

    const provider2Jobs = {
      data: {
        jobsList: {
          '2': {
            position: 'Backend Developer',
            employer: { companyName: 'Provider2 Corp.' },
            location: { city: 'San Francisco', state: 'CA' },
            compensation: { min: 120, max: 180 },
            requirements: { technologies: ['Python', 'Django'] },
            datePosted: new Date(),
          },
        },
      },
    };

    jest.spyOn(httpService, 'get').mockImplementation((url: string) => {
      if (url.includes('provider1')) {
        return of({
          data: provider1Jobs,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        });
      }
      if (url.includes('provider2')) {
        return of({
          data: provider2Jobs,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        });
      }
      return of({
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });
    });

    const loggerSpy = jest.spyOn(jobFetcherService['logger'], 'log');

    await jobFetcherService.fetchAndStoreJobs();

    expect(
      loggerSpy.mock.calls.some((call) =>
        call[0].includes('Starting job fetch and store process'),
      ),
    ).toBe(true);
    expect(
      loggerSpy.mock.calls.some((call) =>
        call[0].includes('Fetching jobs from Provider1'),
      ),
    ).toBe(true);
    expect(
      loggerSpy.mock.calls.some((call) =>
        call[0].includes(
          'Finished fetching from Provider1. Added 1 new jobs, updated 0 jobs.',
        ),
      ),
    ).toBe(true);
    expect(
      loggerSpy.mock.calls.some((call) =>
        call[0].includes('Fetching jobs from Provider2'),
      ),
    ).toBe(true);
    expect(
      loggerSpy.mock.calls.some((call) =>
        call[0].includes(
          'Finished fetching from Provider2. Added 1 new jobs, updated 0 jobs.',
        ),
      ),
    ).toBe(true);
    expect(
      loggerSpy.mock.calls.some((call) =>
        call[0].includes('Job fetch and store process completed'),
      ),
    ).toBe(true);
  });
});
