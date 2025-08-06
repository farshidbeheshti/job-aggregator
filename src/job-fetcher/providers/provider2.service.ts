import { Injectable } from '@nestjs/common';
import { Provider2RawData } from '../../job-offer/interfaces/raw-job-data.interface';
import { TransformedJobOffer } from '../../job-offer/interfaces/transformed-job-offer.interface';
import { BaseJobProvider } from './base-job-provider';

@Injectable()
export class Provider2Service extends BaseJobProvider {
  constructor() {
    super();
  }

  getProviderName(): string {
    return 'Provider2';
  }

  getApiUrl(): string {
    return 'https://assignment.devotel.io/api/provider2/jobs';
  }

  transform(rawData: Provider2RawData): TransformedJobOffer[] {
    const transformedJobs: TransformedJobOffer[] = [];
    for (const jobId in rawData.data.jobsList) {
      const job = rawData.data.jobsList[jobId];
      const {
        employer: { website },
        requirements: { experience },
        compensation: { currency },
        location: { remote },
      } = job;
      const transformedJob: TransformedJobOffer = {
        jobId: jobId,
        title: job.position,
        city: job.location.city,
        state: job.location.state,
        company: job.employer.companyName,
        description: this.buildDescription({
          website,
          experience,
          currency,
          remote,
        }),
        minSalary: job.compensation.min,
        maxSalary: job.compensation.max,
        provider: this.getProviderName(),
        skills: job.requirements.technologies,
        datePosted: job.datePosted,
        rawData: job,
      };
      transformedJobs.push({ ...transformedJob });
    }
    return transformedJobs;
  }

  private buildDescription({
    website,
    experience,
    currency,
    remote,
  }: {
    website?: string;
    experience?: number;
    currency?: string;
    remote?: boolean;
  } = {}): string | undefined {
    const notes: string[] = [];
    if (website) notes.push(`Company Website: ${website}`);

    if (experience) notes.push(`Experience Required: ${experience}`);

    if (currency) notes.push(`Salary in ${currency}`);

    if (remote !== undefined)
      notes.push(`Remote Work: ${(remote && 'YES') || 'NO'}`);
    if (notes?.length) return notes.join('\n');
  }
}
