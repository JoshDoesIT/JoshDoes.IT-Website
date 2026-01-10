import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/unit/setup.ts'],
        include: ['tests/unit/**/*.test.{ts,tsx}'],
        exclude: ['node_modules', '.next', 'tests/e2e'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            exclude: [
                'node_modules/',
                '.next/',
                'tests/e2e/',
                '**/*.config.*',
                '**/*.d.ts',
            ],
            // Global thresholds - prevent regressions
            thresholds: {
                global: {
                    statements: 70,
                    branches: 60,
                    functions: 65,
                    lines: 70,
                },
                // Specific thresholds for tested modules
                'app/blog/utils.ts': {
                    statements: 100,
                    branches: 100,
                    functions: 100,
                    lines: 100,
                },
                'app/blog/markdown.ts': {
                    statements: 90,
                    branches: 85,
                    functions: 100,
                    lines: 90,
                },
                'app/blog/posts.ts': {
                    statements: 85,
                    branches: 80,
                    functions: 100,
                    lines: 85,
                },
                'app/components/*.tsx': {
                    statements: 80,
                    branches: 80,
                    functions: 70,
                    lines: 80,
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
})
