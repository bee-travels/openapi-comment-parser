import { sync as glob } from 'globby';

function convertGlobPaths(globs: string[]): string[] {
	return globs.map((globString) => glob(globString)).flat();
}

export default convertGlobPaths;
