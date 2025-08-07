module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testTimeout: 30000,
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/src/**/*.spec.ts'],
      testPathIgnorePatterns: ['/node_modules/', '.e2e-spec.ts'],
      transform: {
        '^.+\.(t|j)s$': 'ts-jest',
      },
      moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
      },
    },
    {
      displayName: 'e2e',
      testMatch: ['<rootDir>/src/**/*.e2e-spec.ts'],
      testPathIgnorePatterns: ['/node_modules/'],
      transform: {
        '^.+\.(t|j)s$': 'ts-jest',
      },
      moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
      },
      setupFiles: ['<rootDir>/test/setup-e2e.ts'],
    },
  ],
};