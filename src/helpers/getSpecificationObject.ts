import createSpecification from './createSpecification';
import parseApiFile from './parseApiFile';
import convertGlobPaths from './convertGlobPaths';
import finalizeSpecificationObject from './finalizeSpecificationObject';
import updateSpecificationObject from './updateSpecificationObject';

function getSpecificationObject(options) {
  // Get input definition and prepare the specification's skeleton
  const definition = options.swaggerDefinition || options.definition;
  const specification = createSpecification(definition);

  // Parse the documentation containing information about APIs.
  const apiPaths = convertGlobPaths(options.apis);

  for (let i = 0; i < apiPaths.length; i += 1) {
    const parsedFile = parseApiFile(apiPaths[i]);
    updateSpecificationObject(parsedFile, specification);
  }

  return finalizeSpecificationObject(specification);
}

export default getSpecificationObject;
