import type { Config } from '@jest/types';

export default <Config.InitialOptions>{
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  testTimeout: 30000,
};
