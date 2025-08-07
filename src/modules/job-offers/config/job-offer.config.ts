import { registerAs } from '@nestjs/config';
import { DATABSE_CONFIG } from '@src/common/constants';

export default registerAs(DATABSE_CONFIG, () => ({
  jobFetchInterval:
    process.env['SCHEDULER_JOB_FETCH_INTERVAL'] || '*/20 * * * * *',
  jobCleanupInterval: process.env['SCHEDULER_JOB_CLEANUP_INTERVAL'],
  fetchMaxRetriesCount: +(process.env['SCHEDULER_FETCH_MAX_RETRIES'] || 3),
  fetchInitialDelay: +(process.env['SCHEDULER_FETCH_INITIAL_DELAY_MS'] || 2000),
}));
