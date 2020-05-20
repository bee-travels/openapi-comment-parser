import { expect } from 'chai';

import objectMerge from './objectMerge';

describe('objectMerge', () => {
	it('merges path into empty path object', () => {
		const a = {
			paths: {},
		};
		const b = {
			paths: { path1: { name: 'test', description: 'this is a test' } },
		};
		const expected = {
			paths: { path1: { name: 'test', description: 'this is a test' } },
		};

		objectMerge(a, b);

		expect(a).to.deep.equal(expected);
	});

	it('merges path into undefined', () => {
		const a = {};
		const b = {
			paths: { path1: { name: 'test', description: 'this is a test' } },
		};
		const expected = {
			paths: { path1: { name: 'test', description: 'this is a test' } },
		};

		objectMerge(a, b);

		expect(a).to.deep.equal(expected);
	});

	it('merges path and component into nothing', () => {
		const a = {};
		const b = {
			paths: { path1: { name: 'test', description: 'this is a test' } },
			components: { schemas: { fun: { name: 'fun' }, fun2: { name: 'fun2' } } },
		};
		const expected = {
			paths: { path1: { name: 'test', description: 'this is a test' } },
			components: { schemas: { fun: { name: 'fun' }, fun2: { name: 'fun2' } } },
		};

		objectMerge(a, b);

		expect(a).to.deep.equal(expected);
	});

	it('merges path without overriding other path', () => {
		const a = {
			paths: { path1: { name: 'test', description: 'this is a test' } },
		};
		const b = {
			paths: { path2: { name: 'test', description: 'this is a test' } },
		};
		const expected = {
			paths: {
				path1: { name: 'test', description: 'this is a test' },
				path2: { name: 'test', description: 'this is a test' },
			},
		};

		objectMerge(a as any, b as any);

		expect(a).to.deep.equal(expected);
	});

	it('merges 2 deep', () => {
		const a = {
			a: {
				b: {
					name: 'test',
					description: 'this is a test',
					old: 'hi',
				},
			},
		};
		const b = {
			a: {
				b: {
					name: 'test2',
					description: 'this is a test2',
				},
			},
		};
		const expected = {
			a: {
				b: {
					name: 'test2',
					description: 'this is a test2',
					old: 'hi',
				},
			},
		};

		objectMerge(a as any, b as any);

		expect(a).to.deep.equal(expected);
	});

	it('overrides 3 deep', () => {
		const a = {
			a: {
				b: {
					c: {
						name: 'test',
						description: 'this is a test',
						old: 'hi',
					},
				},
			},
		};
		const b = {
			a: {
				b: {
					c: {
						name: 'test2',
						description: 'this is a test2',
					},
				},
			},
		};
		const expected = {
			a: {
				b: {
					c: {
						name: 'test2',
						description: 'this is a test2',
					},
				},
			},
		};

		objectMerge(a as any, b as any);

		expect(a).to.deep.equal(expected);
	});

	it('overrides 4 deep', () => {
		const a = {
			a: {
				b: {
					c: {
						d: {
							name: 'test',
							description: 'this is a test',
							old: 'hi',
						},
					},
				},
			},
		};
		const b = {
			a: {
				b: {
					c: {
						d: {
							name: 'test2',
							description: 'this is a test2',
						},
					},
				},
			},
		};
		const expected = {
			a: {
				b: {
					c: {
						d: {
							name: 'test2',
							description: 'this is a test2',
						},
					},
				},
			},
		};

		objectMerge(a as any, b as any);

		expect(a).to.deep.equal(expected);
	});
});
