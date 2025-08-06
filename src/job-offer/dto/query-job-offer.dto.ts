import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryJobOfferDto {
  @ApiProperty({
    description: 'Filter job offers by a substring in their title.',
    required: false,
    type: String,
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Filter job offers by a substring in their location city.',
    required: false,
    type: String,
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Filter job offers by a substring in their location state.',
    required: false,
    type: String,
    example: 'NY',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description:
      'Filter job offers with a minimum salary greater than or equal to the specified value.',
    required: false,
    type: Number,
    example: 50000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minSalary?: number;

  @ApiProperty({
    description:
      'Filter job offers with a maximum salary less than or equal to the specified value.',
    required: false,
    type: Number,
    example: 100000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxSalary?: number;

  @ApiProperty({
    description:
      'Filter job offers that possess all of the specified skills (substring matching). Multiple skills can be provided as a comma-separated string.',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Transform(({ value }: { value: string }) =>
    Array.isArray(value) ? value : [value],
  )
  skills?: string[];

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    type: Number,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  limit?: number = 10;
}
