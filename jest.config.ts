const nextJest = require('next/jest')
 
const createJestConfig = nextJest({ dir: './' })
 
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: '../coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest', // Ensure TS files are transformed correctly
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Support for absolute imports
    '^lucide-react$':
      '<rootDir>/node_modules/lucide-react/dist/cjs/lucide-react.js',
    '^@/components/ui/(.*)$': '<rootDir>/__mocks__/shadcnMock.js',
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/src/components/ui/', // Ignore button.tsx from coverage
  ],
}
 
module.exports = createJestConfig(customJestConfig)
 
 