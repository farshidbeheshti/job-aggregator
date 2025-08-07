import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { JobOffer } from '../job-offers/job-offer.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('skills')
export class Skill {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the skill',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'TypeScript', description: 'The name of the skill' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    type: () => [JobOffer],
    description: 'A list of job offers associated with this skill',
  })
  @ManyToMany(() => JobOffer, (jobOffer) => jobOffer.skills)
  jobOffers: JobOffer[];
}
