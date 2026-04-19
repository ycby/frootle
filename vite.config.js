import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        minify: true,
        rolldownOptions: {
            output: {
                minify: {
                    compress: {
                        drop_console: true
                    }
                }
            }
        }
    }
});
