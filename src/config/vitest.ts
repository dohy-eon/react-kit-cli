import { ConfigFile } from '../types';

export const vitestConfig: ConfigFile = {
  path: 'vitest.config.ts',
  content: `/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})`,
};

export const vitestDependencies = {
  vitest: '^1.2.2',
  '@testing-library/react': '^14.2.1',
  '@testing-library/jest-dom': '^6.4.2',
  jsdom: '^24.0.0',
};

export const vitestScripts = {
  test: 'vitest',
  'test:ui': 'vitest --ui',
  coverage: 'vitest run --coverage',
};

export const testSetupContent = `import '@testing-library/jest-dom';`;
