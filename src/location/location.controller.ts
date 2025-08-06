import { Controller, Get } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationResponseDto } from './dto/response/location.response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all locations' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all locations',
    type: [LocationResponseDto],
  })
  async findAll(): Promise<LocationResponseDto[]> {
    console.log(
      'herererersssssssssssssssssssssssssssssssssssssssssssssssssssssssssssserere',
    );
    const locations = await this.locationService.findAll();
    return locations.map((location) => new LocationResponseDto(location));
  }
}
