export const mockProvider1RawData = {
  jobs: [
    {
      jobId: '1',
      title: 'Software Engineer',
      details: {
        location: 'New York, NY',
        type: 'Full-time',
        salaryRange: '60000-120000',
      },
      company: {
        name: 'Tech Solutions',
        industry: 'IT',
      },
      skills: ['TypeScript', 'Node.js'],
      postedDate: '2024-07-20',
    },
  ],
  metadata: {
    requestId: 'some-request-id',
    timestamp: '2024-01-01T00:00:00Z',
    source: 'Provider1 API',
  },
};

export const transformedJobOffers = [
  {
    title: 'Software Engineer',
    city: 'New York',
    state: 'NY',
    minSalary: 60000,
    maxSalary: 120000,
    skills: ['TypeScript', 'Node.js'],
    jobId: '1',
    provider: 'Provider1',
    rawData: mockProvider1RawData.jobs[0],
    company: 'Tech Solutions',
    description: 'Job Type: Full-time\nComapny Industry : IT',
    datePosted: '2024-07-20',
  },
];

export const mockProvider2RawData = {
  job_listings: [
    {
      job_title: 'Frontend Developer',
      job_location: 'San Francisco, CA',
      salary_range: '70000-130000',
      required_skills: ['React', 'JavaScript', 'HTML', 'CSS'],
      job_id: '2',
      source: 'Provider2',
    },
  ],
  status: 'success',
  data: {
    jobsList: {
      '2': {
        position: 'Frontend Developer',
        location: {
          city: 'San Francisco',
          state: 'CA',
          remote: false,
        },
        compensation: {
          min: 70000,
          max: 130000,
          currency: 'USD',
        },
        employer: {
          companyName: 'Web Solutions',
          website: 'http://websolutions.com',
        },
        requirements: {
          experience: 3,
          technologies: ['React', 'JavaScript', 'HTML', 'CSS'],
        },
        datePosted: '2024-07-19',
      },
    },
  },
};

export const transformedJobOffersProvider2 = [
  {
    title: 'Frontend Developer',
    city: 'San Francisco',
    state: 'CA',
    minSalary: 70000,
    maxSalary: 130000,
    skills: ['React', 'JavaScript', 'HTML', 'CSS'],
    jobId: '2',
    provider: 'Provider2',
    rawData: mockProvider2RawData.data.jobsList['2'],
    company: 'Web Solutions',
    description: 'Company Website: http://websolutions.com\nExperience Required: 3\nSalary in USD\nRemote Work: NO',
    datePosted: '2024-07-19',
  },
];
