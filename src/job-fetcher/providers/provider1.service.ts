import { Injectable } from '@nestjs/common';
import { Provider1RawData } from '../../job-offer/interfaces/raw-job-data.interface';
import { TransformedJobOffer } from '../../job-offer/interfaces/transformed-job-offer.interface';
import { BaseJobProvider } from './base-job-provider';

@Injectable()
export class Provider1Service extends BaseJobProvider {
  getProviderName(): string {
    return 'Provider1';
  }

  getApiUrl(): string {
    return 'https://assignment.devotel.io/api/provider1/jobs';
  }

  transform(rawData: Provider1RawData): TransformedJobOffer[] {
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
    }) as TransformedJobOffer[];
  }

  private parseMinSalary(salaryRange: string): number | null {
    const match = salaryRange.match(/^(\d+)/);
    return match ? parseFloat(match[1]) : null;
  }

  private parseMaxSalary(salaryRange: string): number | null {
    const match = salaryRange.match(/(\d+)$/);
    return match ? parseFloat(match[1]) : null;
  }

  parseLocation(location: string): { state?: string; city?: string } | null {
    const parts = location
      ?.split(',')
      .map((p) => p.trim())
      .filter((p) => p);
    console.log({ state: parts[1], city: parts[0] });
    if (parts?.length) return { state: parts[1], city: parts[0] };

    return null;
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
