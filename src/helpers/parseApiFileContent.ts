import parse from 'comment-parser';
import jsYaml from 'js-yaml';

/**
 * Parse the provided API file content.
 *
 * @function
 * @param {string} fileContent - Content of the file
 * @param {string} ext - File format ('.yaml', '.yml', '.js', etc.)
 * @returns {{jsdoc: array, yaml: array}} JSDoc comments and Yaml files
 * @requires doctrine
 */
function parseApiFileContent(fileContent, ext) {
	const yaml: any = [];
	let jsDocComments: any = [];

	if (ext === '.yaml' || ext === '.yml') {
		yaml.push(jsYaml.safeLoad(fileContent));
	} else {
		jsDocComments = parse(fileContent);
	}

	return {
		yaml,
		jsdoc: jsDocComments,
	};
}

export default parseApiFileContent;
