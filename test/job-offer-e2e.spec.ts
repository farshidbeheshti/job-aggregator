
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JobOfferResponseDto } from '../src/job-offer/dto/response/job-offer.response.dto';
import { PaginatedJobOfferResponseDto } from '../src/job-offer/dto/response/paginated-job-offer.response.dto';

describe('JobOffer (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/job-offer (GET) - should return a list of job offers', async () => {
    const response = await (request(app.getHttpServer()) as any)
      .get('/job-offer')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('title');
    expect(response.body[0]).toHaveProperty('companyName');
    expect(response.body[0]).toHaveProperty('description');
    expect(response.body[0]).toHaveProperty('skills');
    expect(response.body[0]).toHaveProperty('locations');
  });

  it('/job-offer (GET) - should return job offers filtered by skills', async () => {
    // First, get some existing skills to filter by
    const allJobOffersResponse = await (request(app.getHttpServer()) as any)
      .get('/job-offer')
      .expect(200);

    const firstJobOfferSkills = allJobOffersResponse.body[0].skills;
    if (firstJobOfferSkills.length === 0) {
      console.warn('No skills found for the first job offer, skipping skill filter test.');
      return;
    }
    const skillToFilter = firstJobOfferSkills[0].name;

    const response = await (request(app.getHttpServer()) as any)
      .get(`/job-offer?skills=${skillToFilter}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((jobOffer: JobOfferResponseDto) => {
      expect(jobOffer.skills.some(skill => skill.name === skillToFilter)).toBeTruthy();
    });
  });

  it('/job-offer (GET) - should return job offers filtered by locations', async () => {
    // First, get some existing locations to filter by
    const allJobOffersResponse = await (request(app.getHttpServer()) as any)
      .get('/job-offer')
      .expect(200);

    const firstJobOfferLocations = allJobOffersResponse.body[0].locations;
    if (firstJobOfferLocations.length === 0) {
      console.warn('No locations found for the first job offer, skipping location filter test.');
      return;
    }
    const locationToFilter = firstJobOfferLocations[0].name;

    const response = await (request(app.getHttpServer()) as any)
      .get(`/job-offer?locations=${locationToFilter}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((jobOffer: JobOfferResponseDto) => {
      expect(jobOffer.locations.some(location => location.name === locationToFilter)).toBeTruthy();
    });
  });

  it('/job-offer (GET) - should return paginated job offers with limit and offset', async () => {
    const limit = 2;
    const offset = 1;

    const response = await (request(app.getHttpServer()) as any)
      .get(`/job-offer?limit=${limit}&offset=${offset}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeLessThanOrEqual(limit);

    // To properly test offset, we would need to compare with a non-offsetted query.
    // For now, we just check the limit.
  });

  it('/job-offer (GET) - should return job offers filtered by multiple skills and locations', async () => {
    // Get some existing skills and locations to filter by
    const allJobOffersResponse = await (request(app.getHttpServer()) as any)
      .get('/job-offer')
      .expect(200);

    const skillsToFilter = [];
    const locationsToFilter = [];

    if (allJobOffersResponse.body.length > 1) {
      // Try to get skills from two different job offers to ensure variety
      if (allJobOffersResponse.body[0].skills.length > 0) {
        skillsToFilter.push(allJobOffersResponse.body[0].skills[0].name);
      }
      if (allJobOffersResponse.body[1].skills.length > 0) {
        skillsToFilter.push(allJobOffersResponse.body[1].skills[0].name);
      }
      if (allJobOffersResponse.body[0].locations.length > 0) {
        locationsToFilter.push(allJobOffersResponse.body[0].locations[0].name);
      }
      if (allJobOffersResponse.body[1].locations.length > 0) {
        locationsToFilter.push(allJobOffersResponse.body[1].locations[0].name);
      }
    } else if (allJobOffersResponse.body.length === 1) {
      if (allJobOffersResponse.body[0].skills.length > 0) {
        skillsToFilter.push(allJobOffersResponse.body[0].skills[0].name);
      }
      if (allJobOffersResponse.body[0].locations.length > 0) {
        locationsToFilter.push(allJobOffersResponse.body[0].locations[0].name);
      }
    }

    if (skillsToFilter.length === 0 && locationsToFilter.length === 0) {
      console.warn('Not enough data to perform multi-skill/location filter test, skipping.');
      return;
    }

    const skillQuery = skillsToFilter.map(s => `skills=${s}`).join('&');
    const locationQuery = locationsToFilter.map(l => `locations=${l}`).join('&');
    const queryString = [skillQuery, locationQuery].filter(Boolean).join('&');

    const response = await (request(app.getHttpServer()) as any)
      .get(`/job-offer?${queryString}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(0); // Can be 0 if no match

    response.body.forEach((jobOffer: JobOfferResponseDto) => {
      if (skillsToFilter.length > 0) {
        const hasAnySkill = skillsToFilter.some(filterSkill =>
          jobOffer.skills.some(jobSkill => jobSkill.name === filterSkill)
        );
        expect(hasAnySkill).toBeTruthy();
      }
      if (locationsToFilter.length > 0) {
        const hasAnyLocation = locationsToFilter.some(filterLocation =>
          jobOffer.locations.some(jobLocation => jobLocation.name === filterLocation)
        );
        expect(hasAnyLocation).toBeTruthy();
      }
    });
  });
});
