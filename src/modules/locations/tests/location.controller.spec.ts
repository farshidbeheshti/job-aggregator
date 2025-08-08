
import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from '../location.controller';
import { LocationService } from '../location.service';
import { LocationResponseDto } from '../dto/response/location.response.dto';
import { Location } from '../location.entity';

const mockLocationService = {
  findAll: jest.fn(),
};

describe('LocationController', () => {
  let controller: LocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        { provide: LocationService, useValue: mockLocationService },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const locations = [new Location(), new Location()];
      mockLocationService.findAll.mockResolvedValue(locations);
      const result = await controller.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(LocationResponseDto);
    });
  });
});
