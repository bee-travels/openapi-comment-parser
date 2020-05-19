import { sync as glob } from 'globby';

/**
 * Converts an array of globs to full paths
 * @function
 * @param {array} globs - Array of globs and/or normal paths
 * @return {array} Array of fully-qualified paths
 * @requires glob
 */
function convertGlobPaths(globs) {
	return globs
		.map((globString) => glob(globString))
		.reduce((previous, current) => previous.concat(current), []);
}

export default convertGlobPaths;
