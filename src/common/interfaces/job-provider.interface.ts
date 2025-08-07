import { TransformedJobOffer } from './transformed-job-offer.interface';

export interface JobProvider {
  getProviderName(): string;
  getApiUrl(): string;
  transform(rawData: any): TransformedJobOffer[];
}
