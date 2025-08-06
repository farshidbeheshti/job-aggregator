# API Documentation

## Job Offers Endpoint

### GET /api/job-offers

This endpoint allows you to retrieve a list of job offers, with optional filtering based on various criteria.

#### Supported Query Parameters:

*   `title` (string, optional): Filter job offers by a substring in their title.
    *   Example: `/api/job-offers?title=engineer`
*   `city` (string, optional): Filter job offers by a substring in their location city.
    *   Example: `/api/job-offers?city=new york`
*   `state` (string, optional): Filter job offers by a substring in their location state.
    *   Example: `/api/job-offers?state=CA`
*   `minSalary` (number, optional): Filter job offers with a minimum salary greater than or equal to the specified value.
    *   Example: `/api/job-offers?minSalary=80000`
*   `maxSalary` (number, optional): Filter job offers with a maximum salary less than or equal to the specified value.
    *   Example: `/api/job-offers?maxSalary=120000`
*   `skills` (string[], optional): Filter job offers that possess all of the specified skills (substring matching). Multiple skills can be provided as a comma-separated string.
    *   Example: `/api/job-offers?skills=JavaScript,Node`

#### Example Requests:

1.  **Get all job offers:**
    ```
    GET /api/job-offers
    ```

2.  **Get job offers with "engineer" in the title and "California" as the state:**
    ```
    GET /api/job-offers?title=engineer&state=CA
    ```

3.  **Get job offers with a minimum salary of 100,000 and including "React" and "TypeScript" skills:**
    ```
    GET /api/job-offers?minSalary=100000&skills=React,TypeScript
    ```

#### Example Responses:

```json
[
  {
    "id": 1,
    "jobId": "P1-768",
    "title": "Data Scientist",
    "company": "BackEnd Solutions",
    "description": "Data Scientist",
    "url": "https://example.com/jobs/P1-768",
    "minSalary": 92000,
    "maxSalary": 133000,
    "provider": "Provider1",
    "datePosted": "2025-07-26T14:21:00.937Z",
    "location": {
      "id": 1,
      "city": "Seattle",
      "state": "WA"
    },
    "skills": [
      {
        "id": 1,
        "name": "Java"
      },
      {
        "id": 2,
        "name": "Spring Boot"
      },
      {
        "id": 3,
        "name": "AWS"
      }
    ]
  },
  {
    "id": 2,
    "jobId": "job-503",
    "title": "Frontend Developer",
    "company": "BackEnd Solutions",
    "description": "Frontend Developer",
    "url": "https://techcorp.com",
    "minSalary": 79000,
    "maxSalary": 128000,
    "provider": "Provider2",
    "datePosted": "2025-07-30T00:00:00.000Z",
    "location": {
      "id": 2,
      "city": "Austin",
      "state": "NY"
    },
    "skills": [
      {
        "id": 4,
        "name": "Python"
      },
      {
        "id": 5,
        "name": "Machine Learning"
      },
      {
        "id": 6,
        "name": "SQL"
      }
    ]
  }
]
```
