export interface IProvider1RawJob {
  jobId: string;
  title: string;
  details: {
    location: string;
    type: string;
    salaryRange: string;
  };
  company: {
    name: string;
    industry: string;
  };
  skills: string[];
  postedDate: string;
}

export interface IProvider1RawData {
  metadata: {
    requestId: string;
    timestamp: string;
  };
  jobs: IProvider1RawJob[];
}

export interface IProvider2RawJob {
  position: string;
  location: {
    city: string;
    state: string;
    remote?: boolean;
  };
  compensation: {
    min: number;
    max: number;
    currency?: string;
  };
  employer: {
    companyName: string;
    website?: string;
  };
  requirements: {
    experience?: number;
    technologies: string[];
  };
  datePosted: string;
}

export interface IProvider2RawData {
  status: string;
  data: {
    jobsList: {
      [key: string]: IProvider2RawJob;
    };
  };
}
