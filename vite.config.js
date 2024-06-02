import { defineConfig } from 'vite'
import nodeExternals from 'rollup-plugin-node-externals'

export default defineConfig({
    plugins: [
        nodeExternals(),
        // other plugins follow
    ],
    resolve: {
        alias: {
            yup: 'yup/index.js',
        },
    },
})
