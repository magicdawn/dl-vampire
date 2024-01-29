import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['./test/**/*.test.ts'],
    setupFiles: ['./test/setup.ts'],
    testTimeout: process.env.CI ? 10000 : 2000,
    coverage: {
      include: ['src'],
    },
  },
})
