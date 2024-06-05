import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        exclude: [...configDefaults.exclude, 'packages/template/*'],
        setupFiles: ['src/tests/setupTests.js'],
    },
})
