/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/jest-tests/**/*.[jt]s'],
  setupFiles: ['<rootDir>/jest-setup.ts'],
}
