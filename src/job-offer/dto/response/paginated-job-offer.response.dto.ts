import { ApiProperty } from '@nestjs/swagger';
import { JobOfferResponseDto } from './job-offer.response.dto';
import { IPagination } from '@src/common/interfaces';

export class PaginatedJobOfferResponseDto implements IPagination {
  @ApiProperty({
    type: [JobOfferResponseDto],
    description: 'Array of job offers',
  })
  data: JobOfferResponseDto[];

  @ApiProperty({
    example: 100,
    description: 'Total number of job offers available',
  })
  total: number;

  @ApiProperty({
    example: 1,
    description: 'Current page number',
  })
  currentPage: number;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
  })
  itemsPerPage: number;

  constructor(
    data: JobOfferResponseDto[],
    total: number,
    currentPage: number,
    itemsPerPage: number,
  ) {
    this.data = data;
    this.total = total;
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
  }
}
