#!/usr/bin/env node
const fs = require('fs');
const parseComments = require('./../dist/openapi-comment-parser');

const outputPath = process.argv[2];

const spec = parseComments({ cwd: process.cwd() });

fs.writeFileSync(outputPath, JSON.stringify(spec));
