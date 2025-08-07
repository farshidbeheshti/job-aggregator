import { ITransformedJobOffer } from './transformed-job-offer.interface';

export interface IJobProvider {
  getProviderName(): string;
  getApiUrl(): string;
  transform(rawData: any): ITransformedJobOffer[];
}
