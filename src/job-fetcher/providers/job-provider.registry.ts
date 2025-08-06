import { Injectable, Inject } from '@nestjs/common';
import { BaseJobProvider } from './base-job-provider';
import { JOB_PROVIDERS } from './job-providers.token';

@Injectable()
export class JobProviderRegistry {
  private providers: Map<string, BaseJobProvider> = new Map();

  constructor(
    @Inject(JOB_PROVIDERS) private readonly jobProviders: BaseJobProvider[],
  ) {
    console.log('jobProviders registered  ', jobProviders);
    if (jobProviders?.length)
      jobProviders.forEach((provider) => this.registerProvider(provider));
  }

  registerProvider(provider: BaseJobProvider): void {
    this.providers.set(provider.getProviderName(), provider);
  }

  getProviders(): BaseJobProvider[] {
    return Array.from(this.providers.values());
  }

  getProvider(name: string): BaseJobProvider | undefined {
    return this.providers.get(name);
  }

  removeProvider(name: string): boolean {
    return this.providers.delete(name);
  }
}
