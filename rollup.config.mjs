import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
    input: 'src/Game.js',
    output: {
        file: 'dist/nodeBundle.js',
        format: 'es',
        sourcemap: true
    },
    plugins: [nodeResolve(), terser({
        compress : true,
        module: true
    })]
};