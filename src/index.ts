import path from 'path';
import jsYaml from 'js-yaml';
import callerCallsite from 'caller-callsite';
import chalk from 'chalk';

// @ts-ignore
import { Linter } from 'eslint';
// @ts-ignore
import openapiEslintPlugin from 'eslint-plugin-openapi';

import parseFile from './util/parseFile';
import globList from './util/globList';
import SpecBuilder from './SpecBuilder';
import { ParserOptions, OpenApiObject, BaseDefinition } from './exported';
import yamlLOC from './util/yamlLOC';
import loadDefinition from './util/loadDefinition';
import formatter from './util/formatter';

function getCallerPath() {
	const filename = callerCallsite()?.getFileName();
	if (filename) {
		return path.dirname(filename);
	}
	return '';
}

function parseComments(
	definition: BaseDefinition | string,
	{
		root = getCallerPath(),
		extension = ['.js', '.cjs', '.mjs', '.ts', '.tsx', '.jsx', '.yaml', '.yml'],
		include = ['**'],
		exclude = [
			'coverage/**',
			'packages/*/test{,s}/**',
			'**/*.d.ts',
			'test{,s}/**',
			`test{,-*}.{js,cjs,mjs,ts,tsx,jsx,yaml,yml}`,
			`**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx,yaml,yml}`,
			'**/__tests__/**',

			/* Exclude common development tool configuration files */
			'**/{ava,babel,nyc}.config.{js,cjs,mjs}',
			'**/jest.config.{js,cjs,mjs,ts}',
			'**/{karma,rollup,webpack}.config.js',
			'**/.{eslint,mocha}rc.{js,cjs}',
			'**/.{travis,yarnrc}.yml',
			'**/{docker-compose}.yml',

			// always ignore '**/node_modules/**'
		],
		excludeNodeModules = true,
		verbose = true,
		throwLevel = 'off',
	}: ParserOptions = {}
): OpenApiObject {
	if (!definition) {
		throw new Error('A base OpenAPI definition is required.');
	}

	let definitionObject: BaseDefinition;
	if (typeof definition === 'string') {
		definitionObject = loadDefinition(definition);
	} else {
		definitionObject = definition;
	}

	const spec = new SpecBuilder(definitionObject);

	const files = globList(root, extension, include, exclude, excludeNodeModules);

	const linter = new Linter();
	linter.defineRules({
		...openapiEslintPlugin.rules,
	});

	let totalLOC = 0;
	let allMessages: any[] = [];
	files.forEach((file) => {
		const { parsedFile, messages } = parseFile(file, linter, verbose);
		allMessages.push({ filePath: file, messages: messages });
		const specs = parsedFile.map((item) => item.spec);
		const loc = parsedFile.reduce((acc, cur) => (acc += cur.loc), 0);
		totalLOC += loc;
		spec.addData(specs);
	});

	if (verbose) {
		const errorTable = formatter(allMessages);
		if (errorTable) {
			console.log(errorTable);
		}
	}

	if (throwLevel !== 'off') {
		let errorCount = 0;
		let warningCount = 0;

		allMessages.forEach((result) => {
			result.messages.map((message: any) => {
				if (message.severity === 2) {
					errorCount++;
				} else {
					warningCount++;
				}
			});
		});

		const problemCount = errorCount + warningCount;

		if (throwLevel === 'error' && errorCount > 0) {
			throw new Error(
				`openapi-comment-parser: Found ${errorCount} problem${
					errorCount > 1 ? 's' : ''
				}.`
			);
		}
		if (
			(throwLevel === 'warn' || throwLevel === 'warning') &&
			problemCount > 0
		) {
			throw new Error(
				`openapi-comment-parser: Found ${problemCount} problem${
					problemCount > 1 ? 's' : ''
				}.`
			);
		}
	}

	if (verbose) {
		// Only measure paths and components.
		let pathsAsYaml = '';
		if (spec.paths) {
			pathsAsYaml = jsYaml.safeDump(JSON.parse(JSON.stringify(spec.paths)));
		}
		let componentAsYaml = '';
		if (spec.components) {
			componentAsYaml = jsYaml.safeDump(
				JSON.parse(JSON.stringify(spec.components))
			);
		}
		const originalLOC = yamlLOC(pathsAsYaml) + yamlLOC(componentAsYaml);
		const locDiff = originalLOC - totalLOC;
		const savings = (locDiff / originalLOC) * 100;
		if (locDiff > 0) {
			console.log();
			console.log(
				`✨ You've saved ${chalk.bold(
					locDiff
				)} lines of extra YAML (${chalk.green.bold(
					`\u25BC ${savings.toFixed(1)}%`
				)})`
			);
			console.log();
		}
	}

	return spec;
}

export default parseComments;
