#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const parseComments = require('./../dist/openapi-comment-parser');

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

const spec = parseComments({ cwd: inputPath });

fs.writeFileSync(outputPath, JSON.stringify(spec));
