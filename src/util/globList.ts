// import { sync as glob } from 'globby';
// @ts-ignore
import glob from 'glob';

function convertGlobPaths(globs: string[]): string[] {
	return globs.map((globString) => glob.sync(globString)).flat();
}

export default convertGlobPaths;
