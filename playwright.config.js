// playwright.config.js
// @ts-check
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';

const authFile = 'tests/.auth/user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,   
  reporter: 'html',
  
  // ГЛОБАЛЬНЫЕ ТАЙМАУТЫ:
  timeout: 30000,            
  expect: {
    timeout: 10000,           
  },
  
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
      dependencies: ['setup'], 
      testMatch: '**/*.test.js',
    },
  ],
});