import * as specHelper from './specification';
import filterJsDocComments from './filterJsDocComments';

/**
 * Given an api file parsed for its jsdoc comments and yaml files, update the
 * specification.
 *
 * @param {object} parsedFile - Parsed API file.
 * @param {object} specification - Specification accumulator.
 */
function updateSpecificationObject(parsedFile, specification) {
	specHelper.addDataToSwaggerObject(specification, parsedFile.yaml);

	specHelper.addDataToSwaggerObject(
		specification,
		filterJsDocComments(parsedFile.jsdoc)
	);
}

export default updateSpecificationObject;
