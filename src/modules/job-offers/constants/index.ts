import * as en from '@src/i18n/en/app.json';

export const FETCH_JOB_SCHEDULER_NAME = 'FETCH_JOBs';
export const CLEAN_JOB_SCHEDULER_NAME = 'CLEAN_JOBs';

export const findAllSwagger = {
  summary: en['job-offers'].findAll.summary,
  description: en['job-offers'].findAll.description,
};

export const findOneSwagger = {
  summary: en['job-offers'].findOne.summary,
  description: en['job-offers'].findOne.description,
  notFound: en['job-offers'].findOne.notFound,
};

export const removeSwagger = {
  summary: en['job-offers'].remove.summary,
  success: en['job-offers'].remove.success,
  notFound: en['job-offers'].remove.notFound,
};
