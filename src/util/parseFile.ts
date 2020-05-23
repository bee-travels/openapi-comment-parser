import fs from 'fs';
import path from 'path';

import jsYaml from 'js-yaml';

import commentsToOpenApi from './commentsToOpenApi';
import { OpenApiObject } from '../exported';
import yamlLOC from './yamlLOC';
import { yamlParseError, nonJavascriptFileWarning } from './warnings';

function parseFile(
	file: string,
	verbose?: boolean
): { spec: OpenApiObject; loc: number }[] {
	const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
	const ext = path.extname(file);

	if (ext === '.yaml' || ext === '.yml') {
		try {
			const spec = jsYaml.safeLoad(fileContent);
			const loc = yamlLOC(fileContent);
			return [{ spec: spec, loc: loc }];
		} catch (e) {
			if (verbose) {
				yamlParseError(file, e.message);
			}
		}
		return [];
	} else {
		if (verbose) {
			if (ext !== '.js' && ext !== '.ts') {
				nonJavascriptFileWarning(file, ext);
			}
		}
		return commentsToOpenApi(fileContent, verbose);
	}
}

export default parseFile;
