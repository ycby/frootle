import {playwright} from "@vitest/browser-playwright";
import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: 'istanbul',
        },
        projects: [{
            test: {
                name: 'browser',
                include: ['**/*.browser.test.ts'],
                browser: {
                    provider: playwright(),
                    enabled: true,
                    headless: true,
                    instances: [
                        {browser: 'firefox'},
                    ],
                    screenshotFailures: false,

                }
            }
        }, {
            test: {
                name: 'node',
                include: ['**/*.test.ts'],
                exclude: ['**/*.browser.test.ts'],
                environment: 'node'
            }
        }]
    }
});