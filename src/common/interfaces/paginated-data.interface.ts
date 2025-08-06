import { IPagination } from './pagination.interface';

export interface IPaginatedData<T> extends IPagination {
  data: T[];
}
