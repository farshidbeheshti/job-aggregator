import { Provider1Service } from '../src/job-fetcher/providers/provider1.service';
import {
  mockProvider1RawData,
  transformedJobOffers,
} from './mocks/job-offer.mock';

describe('Provider1Service', () => {
  let service: Provider1Service;

  beforeEach(() => {
    service = new Provider1Service();
  });

  it('should transform raw data correctly', () => {
    const result = service.transform(mockProvider1RawData);
    expect(result).toEqual(transformedJobOffers);
  });
});
