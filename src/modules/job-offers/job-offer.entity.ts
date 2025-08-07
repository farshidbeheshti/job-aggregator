import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Location } from '../locations';
import { Skill } from '../skills';
import { ApiProperty } from '@nestjs/swagger';

@Entity('job_offers')
export class JobOffer {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the job offer',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'JOB-12345',
    description: 'The job ID from the provider',
  })
  @Column({ unique: true })
  jobId: string;

  @ApiProperty({
    example: 'Software Engineer',
    description: 'The title of the job offer',
  })
  @Column()
  title: string;

  @ApiProperty({
    example: 'Google',
    description: 'The company offering the job',
  })
  @Column()
  company: string;

  @ApiProperty({
    type: () => Location,
    description: 'The location of the job offer',
  })
  @ManyToOne(() => Location, { eager: true, nullable: true })
  location: Location;

  @ApiProperty({
    example: 'Develop and maintain software.',
    description: 'A detailed description of the job',
  })
  @Column()
  description: string;

  @ApiProperty({
    example: 80000,
    description: 'The minimum salary for the job offer',
    nullable: true,
  })
  @Column({ type: 'float', nullable: true })
  minSalary: number;

  @ApiProperty({
    example: 120000,
    description: 'The maximum salary for the job offer',
    nullable: true,
  })
  @Column({ type: 'float', nullable: true })
  maxSalary: number;

  @ApiProperty({
    example: 'LinkedIn',
    description: 'The provider of the job offer',
  })
  @Column()
  provider: string;

  @ApiProperty({
    type: () => [Skill],
    description: 'A list of skills required for the job',
  })
  @ManyToMany(() => Skill, { eager: true, cascade: true })
  @JoinTable({ name: 'job_offers_skills' })
  skills: Skill[];

  @ApiProperty({
    example: '2023-10-27T10:00:00Z',
    description: 'The date and time when the job offer was created',
  })
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-11-27T10:00:00Z',
    description: 'The date and time when the job offer was deleted',
    nullable: true,
  })
  @DeleteDateColumn()
  deletedAt?: Date;

  @ApiProperty({
    example: {},
    description: 'The raw data returned by the provider API',
    type: 'object',
    additionalProperties: true,
  })
  @Column({ type: 'jsonb', nullable: true, select: false })
  rawData?: object;
}
