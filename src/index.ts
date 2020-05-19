import parseFile from './util/parseFile';
import globList from './util/globList';
import * as specHelper from './util/specHelper';

function parseComments({ definition, paths }: ParserOptions): OpenApiSpec {
	if (!definition && !paths) {
		throw new Error('Provided options are incorrect.');
	}

	const files = globList(paths);

	const specification = specHelper.createSpecification(definition);

	files.forEach((file) => {
		const parsedFile = parseFile(file);
		specHelper.addDataToSwaggerObject(specification, parsedFile);
	});

	return specHelper.finalizeSpecificationObject(specification);
}

export default parseComments;
