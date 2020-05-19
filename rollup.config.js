import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sucrase from '@rollup/plugin-sucrase';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    plugins: [
      resolve(), // so Rollup can find external packages
      commonjs(), // so Rollup can convert external packages to ES modules
      sucrase({
        // so Rollup can convert TypeScript to JavaScript
        exclude: ['node_modules/**', '**/?(*.)test.ts'],
        transforms: ['typescript'],
      }),
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
