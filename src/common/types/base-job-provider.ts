import { JobProvider } from '../interfaces';
import { TransformedJobOffer } from '../interfaces/transformed-job-offer.interface';

export abstract class BaseJobProvider implements JobProvider {
  abstract getProviderName(): string;
  abstract getApiUrl(): string;
  abstract transform(rawData: any): TransformedJobOffer[];
}
