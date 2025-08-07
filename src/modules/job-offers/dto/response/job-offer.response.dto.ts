import { ApiProperty } from '@nestjs/swagger';
import { LocationResponseDto } from '@src/modules/locations/dto/response';
import { SkillResponseDto } from '@src/modules/skills/dto/response';
import { JobOffer } from '@src/modules/job-offers';

export class JobOfferResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the job offer',
  })
  id: number;

  @ApiProperty({
    example: 'JOB-12345',
    description: 'The job ID from the provider',
  })
  jobId: string;

  @ApiProperty({
    example: 'Software Engineer',
    description: 'The title of the job offer',
  })
  title: string;

  @ApiProperty({
    example: 'Google',
    description: 'The company offering the job',
  })
  company: string;

  @ApiProperty({
    type: () => LocationResponseDto,
    description: 'The location of the job offer',
  })
  location: LocationResponseDto | null;

  @ApiProperty({
    example: 'Develop and maintain software.',
    description: 'A detailed description of the job',
  })
  description: string;

  @ApiProperty({
    example: 80000,
    description: 'The minimum salary for the job offer',
    nullable: true,
  })
  minSalary: number;

  @ApiProperty({
    example: 120000,
    description: 'The maximum salary for the job offer',
    nullable: true,
  })
  maxSalary: number;

  @ApiProperty({
    example: 'LinkedIn',
    description: 'The provider of the job offer',
  })
  provider: string;

  @ApiProperty({
    type: () => [SkillResponseDto],
    description: 'A list of skills required for the job',
  })
  skills: SkillResponseDto[];

  @ApiProperty({
    example: '2023-10-27T10:00:00Z',
    description: 'The date and time when the job offer was created',
  })
  createdAt: string;

  @ApiProperty({
    example: '2023-11-27T10:00:00Z',
    description: 'The date and time when the job offer was deleted',
    nullable: true,
  })
  deletedAt?: string;

  constructor(jobOffer: JobOffer) {
    this.id = jobOffer.id;
    this.jobId = jobOffer.jobId?.trim();
    this.title = jobOffer.title?.trim();
    this.company = jobOffer.company?.trim();
    this.location = jobOffer.location
      ? new LocationResponseDto(jobOffer.location)
      : null;
    this.description = jobOffer.description?.trim();
    this.minSalary = jobOffer.minSalary;
    this.maxSalary = jobOffer.maxSalary;
    this.provider = jobOffer.provider?.trim();
    this.skills = jobOffer.skills
      ? jobOffer.skills.map((skill) => new SkillResponseDto(skill))
      : [];
    this.createdAt = jobOffer.createdAt?.toISOString();
    this.deletedAt = jobOffer.deletedAt?.toISOString();
  }
}
