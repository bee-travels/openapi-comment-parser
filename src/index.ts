import parseFile from './util/parseFile';
import globList from './util/globList';
import SpecBuilder from './SpecBuilder';
import { ParserOptions, OpenApiObject } from './exported';

function parseComments({ definition, paths }: ParserOptions): OpenApiObject {
	if (!definition && !paths) {
		throw new Error('Provided options are incorrect.');
	}

	const spec = new SpecBuilder(definition);

	const files = globList(paths);

	files.forEach((file) => {
		const parsedFile = parseFile(file);
		spec.addData(parsedFile);
	});

	return spec;
}

export default parseComments;
