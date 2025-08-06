import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateJobOfferDto {
  @ApiProperty({ example: 'JOB-12345', description: 'The job ID from the provider' })
  @IsString()
  jobId: string;

  @ApiProperty({ example: 'Software Engineer', description: 'The title of the job offer' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Google', description: 'The company offering the job' })
  @IsString()
  company: string;

  @ApiProperty({ example: 'New York', description: 'The location of the job offer' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'Develop and maintain software.', description: 'A detailed description of the job' })
  @IsString()
  description: string;

  @ApiProperty({ example: 80000, description: 'The minimum salary for the job offer', nullable: true })
  @IsNumber()
  @IsOptional()
  minSalary?: number;

  @ApiProperty({ example: 120000, description: 'The maximum salary for the job offer', nullable: true })
  @IsNumber()
  @IsOptional()
  maxSalary?: number;

  @ApiProperty({ example: 'LinkedIn', description: 'The provider of the job offer' })
  @IsString()
  provider: string;

  @ApiProperty({ example: ['JavaScript', 'TypeScript'], description: 'A list of skills required for the job' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @ApiProperty({ example: {}, description: 'The raw data returned by the provider API', type: 'object', additionalProperties: true, nullable: true })
  @IsOptional()
  rawData?: object;
}
