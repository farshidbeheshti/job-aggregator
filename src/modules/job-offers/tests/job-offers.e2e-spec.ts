import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@src/app.module';
import { JobOfferService } from '../job-offer.service';

describe('JobOffersController (e2e)', () => {
  let app: INestApplication;
  let jobOfferService: JobOfferService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jobOfferService = moduleFixture.get<JobOfferService>(JobOfferService);
    await jobOfferService.removeAll();
  });

  beforeEach(async () => {
    await jobOfferService.removeAll();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/job-offers (GET)', () => {
    it('should return a paginated list of job offers', async () => {
      // Create some test data
      await jobOfferService.saveTransformedJobs([
        {
          jobId: 'tests-123456789',
          title: 'Software Engineer',
          description: 'A great job',
          company: 'Test Inc.',
          provider: 'TestProvider',
          skills: ['TypeScript', 'Node.js'],
          datePosted: new Date(),
        },
        {
          jobId: 'tests-1234567890',
          title: 'Backend Developer',
          description: 'Another great job',
          company: 'Test Corp.',
          provider: 'TestProvider',
          skills: ['Python', 'Django'],
          datePosted: new Date(),
        },
      ]);

      const response = await request(app.getHttpServer())
        .get('/job-offers')
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.currentPage).toBe(1);
    });
  });

  describe('/job-offers/:id (GET)', () => {
    it('should return a single job offer', async () => {
      // Create a test job offer
      await jobOfferService.saveTransformedJobs([
        {
          jobId: 'tests-123456789',
          title: 'Software Engineer',
          description: 'A great job',
          company: 'Test Inc.',
          provider: 'TestProvider',
          skills: ['TypeScript', 'Node.js'],
          datePosted: new Date(),
        },
      ]);

      const jobOffer = (await jobOfferService.findAll({})).data[0];

      const response = await request(app.getHttpServer())
        .get(`/job-offers/${jobOffer.id}`)
        .expect(200);

      expect(response.body.title).toBe('Software Engineer');
    });

    it('should return 404 for a non-existent job offer', async () => {
      await request(app.getHttpServer()).get('/job-offers/999').expect(404);
    });
  });

  describe('/job-offers/:id (DELETE)', () => {
    it('should soft delete a job offer', async () => {
      // Create a test job offer
      await jobOfferService.saveTransformedJobs([
        {
          jobId: 'tests-123456789',
          title: 'Software Engineer',
          description: 'A great job',
          company: 'Test Inc.',
          provider: 'TestProvider',
          skills: ['TypeScript', 'Node.js'],
          datePosted: new Date(),
        },
      ]);

      const jobOffer = (await jobOfferService.findAll({})).data[0];

      await request(app.getHttpServer())
        .delete(`/job-offers/${jobOffer.id}`)
        .expect(204);

      const deletedJobOffer = await jobOfferService.findOne(jobOffer.id);
      expect(deletedJobOffer).toBeNull();
    });
  });
});
