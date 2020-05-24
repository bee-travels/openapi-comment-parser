import path from 'path';
import { sync as glob } from 'globby';

function convertGlobPaths(
	root: string,
	extension: string[],
	include: string[],
	exclude: string[],
	excludeNodeModules: boolean
): string[] {
	const included = include
		.map((globString) => glob(path.join(root, globString)))
		.flat();

	if (excludeNodeModules) {
		exclude.push('**/node_modules/**');
	}

	const excluded = exclude
		.map((globString) => glob(path.join(root, globString)))
		.flat();

	return included.filter((file) => {
		if (excluded.includes(file)) {
			return false;
		}
		if (extension.includes(path.extname(file))) {
			return true;
		}
		return false;
	});
}

export default convertGlobPaths;
