import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      include: ['src/data/**/*.ts', 'src/domain/**/*.ts', 'src/infra/**/*.ts'],
      exclude: ['src/**/test/*', 'src/main', 'src/domain/models/amqp-queue.ts'],
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      all: true,
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100
    },
    setupFiles: ['./.test/setEnvVars.js'],
    mockReset: false,
    testTimeout: 30000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
