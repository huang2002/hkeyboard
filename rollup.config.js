import rollupPluginBabel from "rollup-plugin-babel";

const input = 'raw/index.js';

export default [
    {
        input,
        output: {
            format: 'es',
            file: 'dist/hkeyboard.js'
        }
    },
    {
        input,
        plugins: [
            rollupPluginBabel()
        ],
        output: {
            format: 'umd',
            name: 'HKB',
            file: 'dist/hkeyboard.umd.js'
        }
    }
];
