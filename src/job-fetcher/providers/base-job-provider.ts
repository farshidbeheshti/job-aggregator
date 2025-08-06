import { TransformedJobOffer } from '../../job-offer/interfaces/transformed-job-offer.interface';
import { JobProvider } from '../../job-offer/interfaces/job-provider.interface';

export abstract class BaseJobProvider implements JobProvider {
  abstract getProviderName(): string;
  abstract getApiUrl(): string;
  abstract transform(rawData: any): TransformedJobOffer[];
}
