import fs from 'fs';
import path from 'path';

import jsYaml from 'js-yaml';

import commentsToOpenApi from './commentsToOpenApi';
import { OpenApiObject } from '../exported';
import yamlLOC from './yamlLOC';

const ALLOWED_KEYS = [
	'openapi',
	'info',
	'servers',
	'security',
	'tags',
	'externalDocs',
	'components',
	'paths',
];

function parseFile(
	file: string,
	linter: any,
	verbose?: boolean
): { parsedFile: { spec: OpenApiObject; loc: number }[]; messages: any[] } {
	const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
	const ext = path.extname(file);

	if (ext === '.yaml' || ext === '.yml') {
		try {
			const spec = jsYaml.safeLoad(fileContent);
			const invalidKeys = Object.keys(spec).filter(
				(key) => !ALLOWED_KEYS.includes(key)
			);

			let messages: any = [];
			if (invalidKeys.length > 0) {
				invalidKeys.forEach((key) => {
					messages.push({
						severity: 1,
						message: `unexpected key '${key}'`,
						line: 0,
						column: 0,
					});
					delete spec[key];
				});
			}

			if (Object.keys(spec).find((key) => ALLOWED_KEYS.includes(key))) {
				const loc = yamlLOC(fileContent);
				return {
					parsedFile: [{ spec: spec, loc: loc }],
					messages: messages,
				};
			}

			return { parsedFile: [], messages: messages };
		} catch (e) {
			return {
				parsedFile: [],
				messages: [
					{
						severity: 2,
						message: e.reason,
						line: e.mark.line + 1, // eslint indexed by 1 for line.
						column: e.mark.column,
					},
				],
			};
		}
	} else {
		const messages = linter.verify(fileContent, {
			env: {
				es6: true,
				node: true,
			},

			parserOptions: {
				ecmaVersion: 2018,
				sourceType: 'module',
			},
			rules: {
				warnings: 'warn',
				errors: 'error',
			},
		});
		return {
			parsedFile: commentsToOpenApi(fileContent, verbose),
			messages: messages,
		};
	}
}

export default parseFile;
