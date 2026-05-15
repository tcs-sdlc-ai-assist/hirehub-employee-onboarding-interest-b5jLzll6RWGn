import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'clover'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.js',
        '**/*.config.ts',
        '**/setupTests.js',
      ],
    },
    css: false,
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
});