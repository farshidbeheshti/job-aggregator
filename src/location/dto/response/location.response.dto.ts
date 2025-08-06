import { ApiProperty } from '@nestjs/swagger';
import { Location } from '../../location.entity';

export class LocationResponseDto {
  @ApiProperty({
    example: '1',
    description: 'The unique identifier of the location',
  })
  id: number;

  @ApiProperty({
    example: 'New York',
    description: 'The city of the location',
  })
  city: string;

  @ApiProperty({
    example: 'NY',
    description: 'The state of the location',
  })
  state: string;

  constructor(location: Location) {
    this.id = location.id;
    this.city = location.city;
    this.state = location.state;
  }
}
