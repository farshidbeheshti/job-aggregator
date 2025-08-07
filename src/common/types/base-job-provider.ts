import { IJobProvider, ITransformedJobOffer } from '../interfaces';

export abstract class BaseJobProvider implements IJobProvider {
  abstract getProviderName(): string;
  abstract getApiUrl(): string;
  abstract transform(rawData: any): ITransformedJobOffer[];
}
