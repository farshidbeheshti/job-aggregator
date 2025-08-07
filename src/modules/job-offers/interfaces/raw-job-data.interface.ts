export interface Provider1RawJob {
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

export interface Provider1RawData {
  metadata: {
    requestId: string;
    timestamp: string;
  };
  jobs: Provider1RawJob[];
}

export interface Provider2RawJob {
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

export interface Provider2RawData {
  status: string;
  data: {
    jobsList: {
      [key: string]: Provider2RawJob;
    };
  };
}
