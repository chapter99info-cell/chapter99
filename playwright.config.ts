import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  use: { baseURL: 'http://127.0.0.1:4178' },
  webServer: {
    command: 'npx vite --host 127.0.0.1 --port 4178',
    url: 'http://127.0.0.1:4178/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
