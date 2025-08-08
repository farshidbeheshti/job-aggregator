import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocationService } from '../location.service';
import { Location } from '../location.entity';
import { Repository } from 'typeorm';

const mockLocationRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('LocationService', () => {
  let service: LocationService;
  let repository: Repository<Location>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getRepositoryToken(Location),
          useValue: mockLocationRepository,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    repository = module.get<Repository<Location>>(getRepositoryToken(Location));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrCreate', () => {
    it('should return an existing location if found', async () => {
      const existingLocation = new Location();
      mockLocationRepository.findOne.mockResolvedValue(existingLocation);
      const result = await service.findOrCreate('New York', 'NY');
      expect(result).toEqual(existingLocation);
      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { city: 'New York', state: 'NY' },
      });
      expect(mockLocationRepository.create).not.toHaveBeenCalled();
      expect(mockLocationRepository.save).not.toHaveBeenCalled();
    });

    it('should create and return a new location if not found', async () => {
      mockLocationRepository.findOne.mockResolvedValue(null);
      const newLocation = new Location();
      mockLocationRepository.create.mockReturnValue(newLocation);
      mockLocationRepository.save.mockResolvedValue(newLocation);
      const result = await service.findOrCreate('Los Angeles', 'CA');
      expect(result).toEqual(newLocation);
      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { city: 'Los Angeles', state: 'CA' },
      });
      expect(mockLocationRepository.create).toHaveBeenCalledWith({
        city: 'Los Angeles',
        state: 'CA',
      });
      expect(mockLocationRepository.save).toHaveBeenCalledWith(newLocation);
    });
  });
});
