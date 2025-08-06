import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('JobOffersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/job-offers (GET) should return a paginated list of job offers', () => {
    return (request(app.getHttpServer()) as any)
      .get('/job-offers')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('currentPage');
        expect(res.body).toHaveProperty('itemsPerPage');
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/job-offers?title=Software (GET) should filter by title', () => {
    return (request(app.getHttpServer()) as any)
      .get('/job-offers?title=Software')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/job-offers/:id (GET) should return a single job offer', async () => {
    // First, create a job offer to retrieve
    const createJobOfferDto = {
      title: 'Test Job',
      company: 'Test Company',
      description: 'Test Description',
      minSalary: 50000,
      maxSalary: 100000,
      provider: 'TestProvider',
      jobId: 'test-123',
      location: 'Test City',
      skills: ['TestSkill'],
    };

    const postResponse = await (request(app.getHttpServer()) as any)
      .post('/job-offers')
      .send(createJobOfferDto)
      .expect(201);

    const jobId = postResponse.body.id;

    return (request(app.getHttpServer()) as any)
      .get(`/job-offers/${jobId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', jobId);
        expect(res.body).toHaveProperty('title', createJobOfferDto.title);
      });
  });

  it('/job-offers/:id (DELETE) should delete a job offer', async () => {
    // First, create a job offer to delete
    const createJobOfferDto = {
      title: 'Job to Delete',
      company: 'Delete Co',
      description: 'Delete this job',
      minSalary: 100,
      maxSalary: 200,
      provider: 'DeleteProvider',
      jobId: 'delete-456',
      location: 'Delete City',
      skills: ['DeleteSkill'],
    };

    const postResponse = await (request(app.getHttpServer()) as any)
      .post('/job-offers')
      .send(createJobOfferDto)
      .expect(201);

    const jobId = postResponse.body.id;

    return (request(app.getHttpServer()) as any)
      .delete(`/job-offers/${jobId}`)
      .expect(204);
  });
});
