#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const parseComments = require('./../dist/openapi-comment-parser');

let openapiConfig = {};

try {
  openapiConfig = require(path.resolve('.openapirc.js'));
} catch {}

if (process.argv[2] === '--init') {
  fs.writeFileSync(
    '.openapirc.js',
    `module.exports = {
  extension: ['.js', '.cjs', '.mjs', '.ts', '.tsx', '.jsx', '.yaml', '.yml'],
  include: ['**'],
  exclude: [
    'coverage/**',
    'packages/*/test{,s}/**',
    '**/*.d.ts',
    'test{,s}/**',
    'test{,-*}.{js,cjs,mjs,ts,tsx,jsx,yaml,yml}',
    '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx,yaml,yml}',
    '**/__tests__/**',
    '**/{ava,babel,nyc}.config.{js,cjs,mjs}',
    '**/jest.config.{js,cjs,mjs,ts}',
    '**/{karma,rollup,webpack}.config.js',
    '**/.{eslint,mocha}rc.{js,cjs}',
    '**/.{travis,yarnrc}.yml',
    '**/{docker-compose}.yml',
  ],
  excludeNodeModules: true,
  verbose: true,
  throwLevel: 'off',
};
`
  );
  return;
}

if (process.argv[2] === undefined || process.argv[3] === undefined) {
  console.log('Usage:');
  console.log('  openapi-comment-parser SRC_PATH OUTPUT');
  console.log();
  console.log('Example:');
  console.log('  openapi-comment-parser . openapi.json');
  return;
}

const inputPath = path.resolve(process.argv[2]);
const outputPath = path.resolve(process.argv[3]);

const spec = parseComments({ ...openapiConfig, cwd: inputPath });

fs.writeFileSync(outputPath, JSON.stringify(spec));
