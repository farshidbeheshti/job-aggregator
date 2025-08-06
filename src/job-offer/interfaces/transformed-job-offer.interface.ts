export interface TransformedJobOffer {
  jobId: string;
  title: string;
  company: string;
  description?: string;
  minSalary: number | null;
  maxSalary: number | null;
  provider: string;
  city: string | null;
  state: string | null;
  skills: string[];
  datePosted: string;
  rawData?: object;
}
