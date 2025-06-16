import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      provider: 'playwright',
      enabled: true,
      instances: [
        {browser: 'firefox'},
      ]
    }
  }
})
