import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['text', 'json', 'html']
    },
    browser: {
      provider: playwright(),
      enabled: true,
      instances: [
        {browser: 'firefox'},
      ]
    }
  }
})
