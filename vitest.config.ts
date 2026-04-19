import {playwright} from "@vitest/browser-playwright";
import {defineConfig, defaultExclude} from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: 'istanbul',
        },
        projects: [{
            test: {
                name: 'browser',
                include: ['**/*.browser.test.tsx'],
                exclude: [
                    ...defaultExclude
                ],
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
                exclude: [
                    ...defaultExclude,
                    '**/*.browser.test.ts',
                ],
                environment: 'node'
            }
        }]
    }
});