import getSpecificationObject from './helpers/getSpecificationObject';

interface ParserOptions {
	definition: any;
	apis: string[];
}

function commentParser(options: ParserOptions): any {
	if (!options.definition && !options.apis) {
		throw new Error('Provided options are incorrect.');
	}

	try {
		const specificationObject = getSpecificationObject(options);

		return specificationObject;
	} catch (err) {
		let msg = err.message;
		if (err.mark && err.mark.buffer && err.mark.line) {
			const { line } = err.mark;
			const bufferParts = err.mark.buffer.split('\n');
			bufferParts[
				line
			] = `${bufferParts[line]} -------------- Pay attention at this place`;
			msg = bufferParts.join('\n');
		}
		console.warn(msg);
		throw new Error(err);
	}
}

export default commentParser;
