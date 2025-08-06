import { Test, TestingModule } from '@nestjs/testing';
import { JobOffersController } from '../src/job-offer/job-offers.controller';
import { JobOfferService } from '../src/job-offer/job-offer.service';
import { QueryJobOfferDto } from '../src/job-offer/dto/query-job-offer.dto';
import { JobOffer } from '../src/job-offer/job-offer.entity';
import { PaginatedJobOfferResponseDto } from '../src/job-offer/dto/response/paginated-job-offer.response.dto';
import { JobOfferResponseDto } from '../src/job-offer/dto/response/job-offer.response.dto';

describe('JobOffersController', () => {
  let controller: JobOffersController;
  let service: JobOfferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobOffersController],
      providers: [
        {
          provide: JobOfferService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<JobOffersController>(JobOffersController);
    service = module.get<JobOfferService>(JobOfferService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of job offers', async () => {
      const query: QueryJobOfferDto = {};
      const mockJobOffers: JobOffer[] = [
        {
          id: 1,
          title: 'Software Engineer',
          description: 'test',
          company: 'test',
          minSalary: 100,
          maxSalary: 200,
          provider: 'test',
          jobId: 'test',
          location: { id: 1, city: 'New York', state: 'NY' },
          skills: [],
          rawData: {},
          createdAt: new Date(),
          deletedAt: undefined,
        },
      ];
      const paginatedData = {
        data: mockJobOffers,
        total: 1,
        currentPage: 1,
        itemsPerPage: 10,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(paginatedData);

      const result = await controller.findAll(query);

      expect(result).toBeInstanceOf(PaginatedJobOfferResponseDto);
      expect(result.total).toEqual(1);
      expect(result.data.length).toEqual(1);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single job offer', async () => {
      const mockJobOffer: JobOffer = {
        id: 1,
        title: 'Software Engineer',
        description: 'test',
        company: 'test',
        minSalary: 100,
        maxSalary: 200,
        provider: 'test',
        jobId: 'test',
        location: { id: 1, city: 'New York', state: 'NY' },
        skills: [],
        rawData: {},
        createdAt: new Date(),
        deletedAt: undefined,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockJobOffer);

      const result = await controller.findOne('1');

      expect(result).toBeInstanceOf(JobOfferResponseDto);
      if (result) {
        expect(result.id).toEqual(1);
      }
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should return null if job offer not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('remove', () => {
    it('should remove a job offer', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
