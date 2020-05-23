import jsYaml from 'js-yaml';

import parseFile from './util/parseFile';
import globList from './util/globList';
import SpecBuilder from './SpecBuilder';
import { ParserOptions, OpenApiObject } from './exported';
import yamlLOC from './util/yamlLOC';

function parseComments({
	definition,
	paths,
	verbose = true,
}: ParserOptions): OpenApiObject {
	if (!definition && !paths) {
		throw new Error('Provided options are incorrect.');
	}

	const spec = new SpecBuilder(definition);

	const files = globList(paths);

	let totalLOC = 0;
	files.forEach((file) => {
		const parsedFile = parseFile(file, verbose);
		const specs = parsedFile.map((item) => item.spec);
		const loc = parsedFile.reduce((acc, cur) => (acc += cur.loc), 0);
		totalLOC += loc;
		spec.addData(specs);
	});

	if (verbose) {
		const specAsYaml = jsYaml.safeDump(JSON.parse(JSON.stringify(spec)));
		const originalLOC = yamlLOC(specAsYaml);
		const locDiff = originalLOC - totalLOC;
		const savings = (locDiff / originalLOC) * 100;
		console.log(
			`✨ You've saved ${locDiff} lines of extra YAML (${savings.toFixed(1)}%)`
		);
	}

	return spec;
}

export default parseComments;
