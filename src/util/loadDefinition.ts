import fs from 'fs';
import path from 'path';

import jsYaml from 'js-yaml';

import { BaseDefinition } from '../exported';

function parseFile(file: string): BaseDefinition {
	const ext = path.extname(file);
	if (ext !== '.yaml' && ext !== '.yml' && ext !== '.json') {
		throw new Error('OpenAPI definition path must be YAML or JSON.');
	}

	const fileContent = fs.readFileSync(file, { encoding: 'utf8' });

	if (ext === '.yaml' || ext === '.yml') {
		return jsYaml.safeLoad(fileContent);
	} else {
		return JSON.parse(fileContent);
	}
}

export default parseFile;
