import { Injectable } from '@nestjs/common';
import {
  IProvider1RawData,
  ITransformedJobOffer,
} from '@src/modules/job-offers/interfaces/';
import { BaseJobProvider } from '@src/common/types/base-job-provider';

@Injectable()
export class Provider1Service extends BaseJobProvider {
  getProviderName() {
    return 'Provider1';
  }

  getApiUrl() {
    return 'https://assignment.devotel.io/api/provider1/jobs';
  }

  transform(rawData: IProvider1RawData): ITransformedJobOffer[] {
    return rawData.jobs.map((job) => {
      const {
        details: { type: jobType },
        company: { industry },
      } = job;
      const { city, state } = this.parseLocation(job.details.location) ?? {};
      return {
        jobId: job.jobId,
        title: job.title,
        company: job.company.name,
        description: this.buildDescription(jobType, industry),
        minSalary: this.parseMinSalary(job.details.salaryRange),
        maxSalary: this.parseMaxSalary(job.details.salaryRange),
        provider: this.getProviderName(),
        city: city,
        state: state,
        skills: job.skills,
        datePosted: job.postedDate,
        rawData: job,
      };
    }) as ITransformedJobOffer[];
  }

  private parseMinSalary(salaryRange: string | null): number | null {
    if (salaryRange === null) return null;
    const match = salaryRange.match(/^(\d+)/);
    return match ? parseFloat(match[1]) : null;
  }

  private parseMaxSalary(salaryRange: string | null): number | null {
    if (salaryRange === null) return null;
    const match = salaryRange.match(/(\d+)$/);
    return match ? parseFloat(match[1]) : null;
  }

  parseLocation(
    location: string | null,
  ): { state?: string; city?: string } | null {
    if (!location) return null;
    const parts = location
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p);
    if (parts.length === 0) return null;
    return { city: parts[0], state: parts[1] };
  }

  private buildDescription(
    jobType?: string,
    industry?: string,
  ): string | undefined {
    const notes: string[] = [];
    if (jobType) notes.push(`Job Type: ${jobType}`);
    if (industry) notes.push(`Comapny Industry : ${industry}`);
    if (notes?.length) return notes.join('\n');
  }
}
