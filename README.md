# Job Aggregator

## Overview

The Job Offer Aggregator is a robust backend application built with NestJS, designed to efficiently collect, store, and manage job offers from diverse providers. It exposes RESTful APIs, enabling seamless access to aggregated job data.

## Key Features

- **Automated Job Collection:** Gathers job offers from multiple sources.
- **Resilience with Retries:** Implements retry mechanisms with **exponential backoff** for failed job fetching operations, ensuring data completeness and system robustness.
- **Data Management & Cleanup:** Handles soft-deleted data, with automated processes for periodic cleanup to maintain data integrity and optimize storage.
- **RESTful API:** Provides a well-documented API for querying and retrieving job offers.
- **Scalable Architecture & Extensibility:** Built on NestJS, the project offers a modular and scalable foundation. Adding new job providers is straightforward adn easy (see the [guide](#adding-provider) below, how to add new provider).

## Running The Project

Rename `.env.example` for the first time running the project:

```shell
cp .env.example .env
```

Run the project:

```shell
docker-compose up --build
```

## Design Patterns for Extensibility

The project leverages the **Strategy Pattern** combined with a form of **Registry Pattern** to enable easy addition of new job providers:

- **Strategy Pattern:** The `BaseJobProvider` acts as the common interface for all job providers. Each concrete provider (e.g., `Provider1Service`, `Provider2Service`) implements this interface, encapsulating its specific job fetching logic. The `JobFetcherService` uses these provider strategies polymorphically, allowing for flexible and decoupled integration of new data sources.

- **Registry Pattern:** The `job-provider.registry.ts` (specifically the `createJobProviders` function) functions as a registry. It centralizes the collection and provision of all available `BaseJobProvider` implementations, simplifying the management and injection of new provider instances into the system.

### Logs are stored in the files in the `log` folder, managed using `Winston` for comprehensive logging.

### Accessing the API Documentation

Once the application is running, you can access the interactive API documentation (Swagger UI) by navigating to `http://localhost:<APP_PORT>/docs` in your web browser. Replace `<APP_PORT>` with the value configured in your `.env` file (default is `3000`).

## ERD

Refer to the `assets` folder to view the Entity-Relationship Diagram (ERD) image of the database schema.

## Environment Variables

The project uses the following environment variables, which can be configured in the `.env` file:

| Variable Name                      | Description                                                                                                                        |
| :--------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| `SCHEDULER_JOB_FETCH_INTERVAL`     | Cron expression for how often job offers are fetched.                                                                              |
| `SCHEDULER_JOB_CLEANUP_INTERVAL`   | Cron expression for how often soft-deleted data is cleaned up. Leave it empty if you don't want to clean up the soft-deleted data. |
| `SCHEDULER_FETCH_MAX_RETRIES`      | Maximum number of retries for failed job fetching operations.                                                                      |
| `SCHEDULER_FETCH_INITIAL_DELAY_MS` | Initial delay in milliseconds before the first retry attempt.                                                                      |
| `DB_USERNAME`                      | Username for the PostgreSQL database.                                                                                              |
| `DB_PASSWORD`                      | Password for the PostgreSQL database.                                                                                              |
| `DB_DATABASE`                      | Name of the PostgreSQL database.                                                                                                   |
| `DB_PORT`                          | Port number for the PostgreSQL database.                                                                                           |
| `APP_PORT`                         | Port on which the NestJS application will run.                                                                                     |

<a id='adding-provider'></a>

## How to add New Job Providers

To add a new job provider (e.g., `Provider3`):

1.  **Create a new service file:** (e.g., `src/modules/job-fetcher/providers/provider3.service.ts`).
2.  **Extend `BaseJobProvider`:** Your new service must extend the `BaseJobProvider` class and implement the required methods (e.g., `transform`, `getProviderName`, `getApiUrl`).

    ```typescript
    // src/modules/job-fetcher/providers/provider3.service.ts
    import { Injectable } from '@nestjs/common';
    import { BaseJobProvider } from './base-job-provider';
    import { RawJobData } from '@src/modules/job-offers/interfaces/raw-job-data.interface';

    @Injectable()
    export class Provider3Service extends BaseJobProvider {
      getProviderName() {
        return '<PROVER_NAME>';
      }
      getApiUrl() {
        return '<API_URL>';
      }
      transform(rawData: Provider1RawData): TransformedJobOffer[] {
        // transform the raw data for storing in the db
      }
    }
    ```

3.  **Register the new provider:** finally, Add your new provider service to the `job-fetcher.module.ts`. It is injected and automatically registered as a provider. - **`src/modules/job-fetcher/job-fetcher.module.ts`:**

          ```typescript
          // Add Provider3Service to the providers array
          providers: [
            {
              provide: JOB_PROVIDERS,
              useFactory: () => [
                new Provider1Service(),
                new Provider2Service(),
                new Provider3Service() // Add your new provider here ...
              ]
            }
            /* ... */
          ],
          ```

    After these steps, your new job provider will be integrated into the system and its `fetchJobs` method will be called during the job collection process.

## Tests:

`fetchAndStoreJobs` as the key functionality, are covered by unit test to ensure reliability and correctness.

### Run Tests

```shell
run npm test
```
