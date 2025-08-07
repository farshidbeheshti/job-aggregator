import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull, Brackets } from 'typeorm';
import { JobOffer } from './job-offer.entity';
import { TransformedJobOffer } from './interfaces';
import { LocationService } from '../locations/';
import { Skill, SkillService } from '../skills';
import { QueryJobOfferDto } from './dto';

import { IPaginatedData } from '@src/common/interfaces';

@Injectable()
export class JobOfferService {
  private readonly logger = new Logger(JobOfferService.name);

  constructor(
    @InjectRepository(JobOffer)
    private jobOfferRepository: Repository<JobOffer>,
    private readonly locationService: LocationService,
    private readonly skillService: SkillService,
  ) {}

  async findAll(query: QueryJobOfferDto): Promise<IPaginatedData<JobOffer>> {
    const {
      title,
      city,
      state,
      minSalary,
      maxSalary,
      skills,
      page = 1,
      limit = 10,
    } = query;
    const queryBuilder = this.jobOfferRepository.createQueryBuilder('jobOffer');
    queryBuilder.leftJoinAndSelect('jobOffer.location', 'location');
    queryBuilder.leftJoinAndSelect('jobOffer.skills', 'skill');

    if (title)
      queryBuilder.andWhere('jobOffer.title ILIKE :title', {
        title: `%${title}%`,
      });

    if (city)
      queryBuilder.andWhere('location.city ILIKE :city', { city: `%${city}%` });

    if (state)
      queryBuilder.andWhere('location.state ILIKE :state', {
        state: `%${state}%`,
      });

    if (minSalary)
      queryBuilder.andWhere('jobOffer.minSalary >= :minSalary', { minSalary });

    if (maxSalary)
      queryBuilder.andWhere('jobOffer.maxSalary <= :maxSalary', { maxSalary });

    if (skills && skills.length > 0) {
      const subQuery = this.jobOfferRepository
        .createQueryBuilder('jobOffer')
        .select('jobOffer.id')
        .innerJoin('jobOffer.skills', 'skill')
        .where(
          new Brackets((qb) => {
            skills.forEach((skill, index) => {
              const paramName = `skill${index}`;
              qb.orWhere(`skill.name ILIKE :${paramName}`, {
                [paramName]: `%${skill}%`,
              });
            });
          }),
        );

      queryBuilder.andWhere(`jobOffer.id IN (${subQuery.getQuery()})`);
      queryBuilder.setParameters(subQuery.getParameters());
    }

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  async findOne(id: number): Promise<JobOffer | null> {
    return this.jobOfferRepository.findOne({
      where: { id },
      relations: ['location', 'skills'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.jobOfferRepository.softDelete(id);
  }

  async cleanupSoftDeletedJobs() {
    this.logger.log('Starting soft-deleted jobs cleanup process...');
    const result = await this.jobOfferRepository.delete({
      deletedAt: Not(IsNull()),
    });
    this.logger.log(`Cleaned up ${result.affected || 0} soft-deleted jobs.`);
  }

  async saveTransformedJobs(
    jobs: TransformedJobOffer[],
  ): Promise<{ newJobsCount: number; updatedJobsCount: number }> {
    let newJobsCount = 0;
    let updatedJobsCount = 0;

    for (const job of jobs) {
      const { isNew } = await this._processAndSaveJob(job);
      if (isNew) {
        newJobsCount++;
      } else {
        updatedJobsCount++;
      }
    }
    return { newJobsCount, updatedJobsCount };
  }

  private async _processAndSaveJob(
    job: TransformedJobOffer,
  ): Promise<{ isNew: boolean }> {
    const location = await this.locationService.findOrCreate(
      job.city || '',
      job.state || '',
    );

    const skills: Skill[] = await Promise.all(
      job.skills.map((skillName) => this.skillService.findOrCreate(skillName)),
    );

    const existingJob = await this.jobOfferRepository.findOne({
      where: { jobId: job.jobId, provider: job.provider },
      withDeleted: true,
    });

    if (existingJob) {
      Object.assign(existingJob, {
        ...job,
        location,
        skills,
        rawData: job.rawData,
      });
      await this.jobOfferRepository.save(existingJob);
      return { isNew: false };
    } else {
      const newJob: Partial<JobOffer> = {
        ...job,
        location,
        skills,
        minSalary: job.minSalary === null ? undefined : job.minSalary,
        maxSalary: job.maxSalary === null ? undefined : job.maxSalary,
        rawData: job.rawData,
      };
      await this.jobOfferRepository.save(newJob as JobOffer);
      return { isNew: true };
    }
  }
}
