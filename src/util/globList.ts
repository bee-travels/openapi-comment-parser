import path from 'path';
import { sync as glob } from 'globby';

function convertGlobPaths(
	cwd: string,
	extension: string[],
	include: string[],
	exclude: string[],
	excludeNodeModules: boolean
): string[] {
	if (excludeNodeModules) {
		exclude.push('**/node_modules/**');
	}

	const included = include
		.map((globString) =>
			glob(globString, {
				cwd: cwd,
				absolute: true,
				onlyFiles: true,
				ignore: exclude,
			})
		)
		.flat()
		.filter((file) => {
			if (extension.includes(path.extname(file))) {
				return true;
			}
			return false;
		});

	return included;
}

export default convertGlobPaths;
