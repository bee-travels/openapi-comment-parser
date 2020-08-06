const DEFAULT_OPTIONS = {
	cwd: undefined,
	extension: ['.js', '.cjs', '.mjs', '.ts', '.tsx', '.jsx', '.yaml', '.yml'],
	include: ['**'],
	exclude: [
		'coverage/**',
		'packages/*/test{,s}/**',
		'**/*.d.ts',
		'test{,s}/**',
		`test{,-*}.{js,cjs,mjs,ts,tsx,jsx,yaml,yml}`,
		`**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx,yaml,yml}`,
		'**/__tests__/**',

		/* Exclude common development tool configuration files */
		'**/{ava,babel,nyc}.config.{js,cjs,mjs}',
		'**/jest.config.{js,cjs,mjs,ts}',
		'**/{karma,rollup,webpack}.config.js',
		'**/.{eslint,mocha}rc.{js,cjs}',
		'**/.{travis,yarnrc}.yml',
		'**/{docker-compose}.yml',

		// always ignore '**/node_modules/**'
	],
	excludeNodeModules: true,
	verbose: true,
	throwLevel: 'off',
};

export default DEFAULT_OPTIONS;
