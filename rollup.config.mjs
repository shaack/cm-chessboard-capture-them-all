import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { readFileSync, writeFileSync } from 'fs';

function cacheBustIndexHtml() {
    return {
        name: 'cache-bust-index-html',
        writeBundle() {
            const timestamp = Date.now();
            let html = readFileSync('dist/index.html', 'utf-8');
            html = html.replace(/\?v=\d+/g, `?v=${timestamp}`);
            writeFileSync('dist/index.html', html);
            console.log(`Cache-busted dist/index.html with v=${timestamp}`);
        }
    };
}

export default {
    input: 'src/App.js',
    output: {
        file: 'dist/bundle.js',
        format: 'es',
        sourcemap: true
    },
    plugins: [nodeResolve(), terser({
        compress: true,
        module: true
    }), cacheBustIndexHtml()]
};
