import {
  Controller,
  Get,
  Param,
  Query,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { QueryJobOfferDto } from './dto/query-job-offer.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { findAllSwagger, findOneSwagger, removeSwagger } from './constants';
import { JobOfferResponseDto } from './dto/response/job-offer.response.dto';
import { PaginatedJobOfferResponseDto } from './dto/response/paginated-job-offer.response.dto';
import { JobOffer } from './job-offer.entity';
import { IPaginatedData } from '@src/common/interfaces';

@ApiTags('job-offers')
@Controller('job-offers')
export class JobOffersController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @Get()
  @ApiOperation({ summary: findAllSwagger.summary })
  @ApiResponse({
    status: 200,
    description: findAllSwagger.description,
    type: PaginatedJobOfferResponseDto,
  })
  async findAll(
    @Query() query: QueryJobOfferDto,
  ): Promise<PaginatedJobOfferResponseDto> {
    const paginatedData: IPaginatedData<JobOffer> =
      await this.jobOfferService.findAll(query);

    const jobOfferResponseDtos = paginatedData.data.map(
      (jobOffer) => new JobOfferResponseDto(jobOffer),
    );
    return new PaginatedJobOfferResponseDto(
      jobOfferResponseDtos,
      paginatedData.total,
      paginatedData.currentPage,
      paginatedData.itemsPerPage,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: findOneSwagger.summary })
  @ApiResponse({
    status: 200,
    description: findOneSwagger.description,
    type: JobOfferResponseDto,
  })
  @ApiResponse({ status: 404, description: findOneSwagger.notFound })
  async findOne(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<JobOfferResponseDto | null> {
    const jobOffer = await this.jobOfferService.findOne(+id);
    return jobOffer && new JobOfferResponseDto(jobOffer);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: removeSwagger.summary })
  @ApiResponse({ status: 204, description: removeSwagger.success })
  @ApiResponse({ status: 404, description: removeSwagger.notFound })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.jobOfferService.remove(+id);
  }
}
