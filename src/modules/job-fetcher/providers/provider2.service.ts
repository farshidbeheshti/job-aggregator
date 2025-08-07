import { Injectable } from '@nestjs/common';
import { Provider2RawData } from '@src/modules/job-offers/interfaces';
import { TransformedJobOffer } from '@src/modules/job-offers/interfaces';
import { BaseJobProvider } from '@src/common/types/base-job-provider';

@Injectable()
export class Provider2Service extends BaseJobProvider {
  constructor() {
    super();
  }

  getProviderName() {
    return 'Provider2';
  }

  getApiUrl() {
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

    if (remote !== undefined) {
      notes.push(`Remote Work: ${(remote && 'YES') || 'NO'}`);
    } else {
      notes.push(`Remote Work: NO`);
    }
    if (notes.length > 0) return notes.join('\n');
    return undefined;
  }
}
