// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

const authFile = 'tests/.auth/user.json';

export default defineConfig({
  testDir: './tests',

  // 🔹 ГЛОБАЛЬНЫЙ SETUP — выполняется перед ЛЮБЫМ запуском
  globalSetup: './tests/setup/global.setup.js',

  fullyParallel: false, // ✅ Последовательно для зависимых тестов
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1, // ✅ Один воркер = одна сессия
  reporter: 'line',

  timeout: 30000,
  expect: { timeout: 15000 },

  use: {
    baseURL: 'https://realworld.qa.guru',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // 🔹 Один источник истины для сессии
    storageState: 'tests/.auth/user.json',
    actionTimeout: 15000,
    navigationTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*\.test\.js/,
      // dependencies: ['setup'],
      // testMatch: '**/*.test.js',
    },
  ],

  // 🔹 Allure репортер
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright',
      { detail: true,
        suiteTitle: true,
        environmentInfo: {
          browser: 'chromium',
          os: 'Windows',
          project: 'HW_JS_Playwright',
        },
      },
    ],
  ],
});
