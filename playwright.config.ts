import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  reporter: [
    ['html', { outputFolder: 'test-results', open: 'always' }],
    ['list'],
  ]
});