import { Test, TestingModule } from '@nestjs/testing';
import { JobOffersController } from '../job-offers.controller';
import { JobOfferService } from '../job-offer.service';
import { QueryJobOfferDto } from '../dto';
import { PaginatedJobOfferResponseDto } from '../dto/response/paginated-job-offer.response.dto';
import { JobOfferResponseDto } from '../dto/response/job-offer.response.dto';
import { JobOffer } from '../job-offer.entity';

const mockJobOfferService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('JobOffersController', () => {
  let controller: JobOffersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobOffersController],
      providers: [{ provide: JobOfferService, useValue: mockJobOfferService }],
    }).compile();

    controller = module.get<JobOffersController>(JobOffersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return a paginated list of job offers', async () => {
      const result = {
        data: [],
        total: 0,
        currentPage: 1,
        itemsPerPage: 10,
      };
      mockJobOfferService.findAll.mockResolvedValue(result);
      const response = await controller.findAll(new QueryJobOfferDto());
      expect(response).toBeInstanceOf(PaginatedJobOfferResponseDto);
    });
  });

  describe('findOne', () => {
    it('should return a single job offer', async () => {
      const jobOffer = new JobOffer();
      mockJobOfferService.findOne.mockResolvedValue(jobOffer);
      const response = await controller.findOne('1');
      expect(response).toBeInstanceOf(JobOfferResponseDto);
    });
  });

  describe('remove', () => {
    it('should remove a job offer', async () => {
      await controller.remove(1);
      expect(mockJobOfferService.remove).toHaveBeenCalledWith(1);
    });
  });
});
