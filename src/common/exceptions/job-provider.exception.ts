import { HttpException, HttpStatus } from '@nestjs/common';

export class JobProviderException extends HttpException {
  constructor(message: string, providerName: string, originalError?: unknown) {
    super(
      `Error from ${providerName} provider: ${message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    this.name = 'JobProviderException';
    if (originalError instanceof Error) {
      this.stack = originalError.stack;
    } else if (typeof originalError === 'string') {
      this.stack = originalError;
    }
  }
}
