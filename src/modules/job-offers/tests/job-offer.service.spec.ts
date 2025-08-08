import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JobOfferService } from '../job-offer.service';
import { JobOffer } from '../job-offer.entity';
import { LocationService } from '../../locations';
import { SkillService } from '../../skills';
import { Repository } from 'typeorm';

const mockJobOfferRepository = {
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  })),
  findOne: jest.fn(),
  softDelete: jest.fn(),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
  save: jest.fn(),
};

const mockLocationService = {
  findOrCreate: jest.fn(),
};

const mockSkillService = {
  findOrCreate: jest.fn(),
};

describe('JobOfferService', () => {
  let service: JobOfferService;
  let repository: Repository<JobOffer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobOfferService,
        {
          provide: getRepositoryToken(JobOffer),
          useValue: mockJobOfferRepository,
        },
        { provide: LocationService, useValue: mockLocationService },
        { provide: SkillService, useValue: mockSkillService },
      ],
    }).compile();

    service = module.get<JobOfferService>(JobOfferService);
    repository = module.get<Repository<JobOffer>>(getRepositoryToken(JobOffer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return a paginated list of job offers', async () => {
      const result = await service.findAll({});
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a single job offer', async () => {
      const jobOffer = new JobOffer();
      mockJobOfferRepository.findOne.mockResolvedValue(jobOffer);
      const result = await service.findOne(1);
      expect(result).toEqual(jobOffer);
    });
  });

  describe('remove', () => {
    it('should soft delete a job offer', async () => {
      await service.remove(1);
      expect(mockJobOfferRepository.softDelete).toHaveBeenCalledWith(1);
    });
  });

  describe('cleanupSoftDeletedJobs', () => {
    it('should clean up soft deleted jobs', async () => {
      await service.cleanupSoftDeletedJobs();
      expect(mockJobOfferRepository.delete).toHaveBeenCalled();
    });
  });

  describe('saveTransformedJobs', () => {
    it('should save transformed jobs', async () => {
      const jobs = [
        {
          jobId: 'tests-1',
          title: 'Software Engineer',
          description: 'A great job',
          company: 'Test Inc.',
          provider: 'TestProvider',
          skills: ['TypeScript', 'Node.js'],
          datePosted: new Date(),
        },
      ];
      mockLocationService.findOrCreate.mockResolvedValue({
        id: 1,
        name: 'Test Location',
      });
      mockSkillService.findOrCreate.mockResolvedValue({
        id: 1,
        name: 'TypeScript',
      });
      mockJobOfferRepository.findOne.mockResolvedValue(null);
      await service.saveTransformedJobs(jobs);
      expect(mockJobOfferRepository.save).toHaveBeenCalled();
    });
  });
});
