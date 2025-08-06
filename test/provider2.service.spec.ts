import { Provider2Service } from '../src/job-fetcher/providers/provider2.service';
import {
  mockProvider2RawData,
  transformedJobOffersProvider2,
} from './mocks/job-offer.mock';

describe('Provider2Service', () => {
  let service: Provider2Service;

  beforeEach(() => {
    service = new Provider2Service();
  });

  it('should transform raw data correctly', () => {
    const result = service.transform(mockProvider2RawData);
    expect(result).toEqual(transformedJobOffersProvider2);
  });
});
