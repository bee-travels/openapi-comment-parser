/* global it, describe */

import { expect } from 'chai';

import _ from '../commentToString';

import filterJsDocComments from '../../src/helpers/filterJsDocComments';
import parseApiFileContent from '../../src/helpers/parseApiFileContent';

describe('new doc comments form', () => {
	it("random properities I don't normally use", () => {
		const comment = _(() => {
			/**
			 * GET /
			 * @operationId listVersionsv2
			 * @summary List API versions
			 * @response 200 - 200 response
			 * @response 300 - 300 response
			 */
		});

		const expected = {
			'/': {
				get: {
					operationId: 'listVersionsv2',
					summary: 'List API versions',
					responses: {
						'200': {
							description: '200 response',
						},
						'300': {
							description: '300 response',
						},
					},
				},
			},
		};
		const { jsdoc } = parseApiFileContent(comment, undefined);
		const [specification] = filterJsDocComments(jsdoc);
		expect(specification).to.deep.equal(expected);
	});

	it('simple example', () => {
		const comment = _(() => {
			/**
			 * GET /hello
			 * @description Get a "hello world" message.
			 * @response 200 - hello world.
			 */
		});

		// TODO: this isn't valid openapi, schema isn't allowed here.
		const expected = {
			'/hello': {
				get: {
					description: 'Get a "hello world" message.',
					responses: {
						'200': {
							description: 'hello world.',
						},
					},
				},
			},
		};
		const { jsdoc } = parseApiFileContent(comment, undefined);
		const [specification] = filterJsDocComments(jsdoc);
		expect(specification).to.deep.equal(expected);
	});

	it('2 examples', () => {
		const comment = _(() => {
			/**
			 * POST /hello
			 * @description Get a "hello world" message.
			 * @response 200 - hello world.
			 * @responseContent {string} 200.text/plain
			 */

			const garbage = 'trash';
			console.log(garbage);

			/**
			 * GET /hello
			 * @description Get a "hello world" message.
			 * @response 200 - hello world.
			 * @responseContent {string} 200.text/plain
			 */
		});

		const expected1 = {
			'/hello': {
				post: {
					description: 'Get a "hello world" message.',
					responses: {
						'200': {
							description: 'hello world.',
							content: {
								'text/plain': {
									schema: {
										type: 'string',
									},
								},
							},
						},
					},
				},
			},
		};

		const expected2 = {
			'/hello': {
				get: {
					description: 'Get a "hello world" message.',
					responses: {
						'200': {
							description: 'hello world.',
							content: {
								'text/plain': {
									schema: {
										type: 'string',
									},
								},
							},
						},
					},
				},
			},
		};
		const { jsdoc } = parseApiFileContent(comment, undefined);
		const [spec1, spec2] = filterJsDocComments(jsdoc);

		expect(spec1).to.deep.equal(expected1);
		expect(spec2).to.deep.equal(expected2);
	});

	it('complex example', () => {
		const comment = _(() => {
			/**
			 * GET /api/v1/cars/{country}/{city}
			 * @description Get a list of cars at a location.
			 * @pathParam {string} country - Country of the rental company.
			 * @pathParam {string} city - City of the rental company.
			 * @queryParam {string} [company] - Rental Company name.
			 * @queryParam {string} [car] - Car Name.
			 * @queryParam {string} [type] - Car Type.
			 * @queryParam {string} [style] - Car Style.
			 * @queryParam {number} [mincost] - Min Cost.
			 * @queryParam {number} [maxcost] - Max Cost.
			 * @response 200 - A list of cars.
			 * @responseContent {string[]} 200.application/json
			 * @response 400 - Example Error.
			 */
		});

		const expected = {
			'/api/v1/cars/{country}/{city}': {
				get: {
					description: 'Get a list of cars at a location.',
					parameters: [
						{
							in: 'path',
							name: 'country',
							description: 'Country of the rental company.',
							required: true,
							schema: {
								type: 'string',
							},
						},
						{
							in: 'path',
							name: 'city',
							description: 'City of the rental company.',
							required: true,
							schema: {
								type: 'string',
							},
						},
						{
							in: 'query',
							name: 'company',
							description: 'Rental Company name.',
							required: false,
							schema: {
								type: 'string',
							},
						},
						{
							in: 'query',
							name: 'car',
							description: 'Car Name.',
							required: false,
							schema: {
								type: 'string',
							},
						},
						{
							in: 'query',
							name: 'type',
							description: 'Car Type.',
							required: false,
							schema: {
								type: 'string',
							},
						},
						{
							in: 'query',
							name: 'style',
							description: 'Car Style.',
							required: false,
							schema: {
								type: 'string',
							},
						},
						{
							in: 'query',
							name: 'mincost',
							description: 'Min Cost.',
							required: false,
							schema: {
								type: 'number',
							},
						},
						{
							in: 'query',
							name: 'maxcost',
							description: 'Max Cost.',
							required: false,
							schema: {
								type: 'number',
							},
						},
					],
					responses: {
						'200': {
							description: 'A list of cars.',
							content: {
								'application/json': {
									schema: {
										type: 'array',
										items: {
											type: 'string',
										},
									},
								},
							},
						},
						'400': {
							description: 'Example Error.',
						},
					},
				},
			},
		};
		const { jsdoc } = parseApiFileContent(comment, undefined);
		const [specification] = filterJsDocComments(jsdoc);
		expect(specification).to.deep.equal(expected);
	});

	it('simple post', () => {
		const comment = _(() => {
			/**
			 * POST /hello
			 * @description Post a "hello world" message.
			 * @bodyContent {boolean} application/json
			 * @bodyDescription Whether or not to say hello world.
			 * @response 200 - hello world.
			 */
		});

		const expected = {
			'/hello': {
				post: {
					description: 'Post a "hello world" message.',
					requestBody: {
						description: 'Whether or not to say hello world.',
						content: {
							'application/json': {
								schema: {
									type: 'boolean',
								},
							},
						},
					},
					responses: {
						'200': {
							description: 'hello world.',
						},
					},
				},
			},
		};
		const { jsdoc } = parseApiFileContent(comment, undefined);
		const [specification] = filterJsDocComments(jsdoc);
		expect(specification).to.deep.equal(expected);
	});

	it('form post', () => {
		const comment = _(() => {
			/**
			 * POST /hello
			 * @description Post a "hello world" message.
			 * @bodyContent {ExampleObject} application/x-www-form-urlencoded
			 * @bodyDescription A more complicated object.
			 * @response 200 - hello world.
			 */
		});

		const expected = {
			'/hello': {
				post: {
					description: 'Post a "hello world" message.',
					requestBody: {
						description: 'A more complicated object.',
						content: {
							'application/x-www-form-urlencoded': {
								schema: {
									$ref: '#/components/schemas/ExampleObject',
								},
							},
						},
					},
					responses: {
						'200': {
							description: 'hello world.',
						},
					},
				},
			},
		};
		const { jsdoc } = parseApiFileContent(comment, undefined);
		const [specification] = filterJsDocComments(jsdoc);
		expect(specification).to.deep.equal(expected);
	});

	it('many bodies post', () => {
		// Note: We can't use "*/*" in doc comments.
		const comment = _(() => {
			/**
			 * POST /hello
			 * @description Post a "hello world" message.
			 * @bodyContent {ExampleObject} application/x-www-form-urlencoded
			 * @bodyContent {ExampleObject} application/json
			 * @bodyContent {binary} image/png
			 * @bodyContent {string} *\/*
			 * @bodyDescription A more complicated object.
			 * @bodyRequired
			 * @response 200 - hello world.
			 * @responseContent {Car[]} 200.application/json - A list of cars
			 * @responseHeader {string} 200.x-next - A link to the next page of responses
			 * @responseExample {Example} 200.application/json.example1
			 * @responseContent {string} 400.application/json - error message
			 * @responseHeader {string} 400.fake-header - A fake header
			 * @responseExample {Example} 400.application/json.example1
			 * @response 400 - error.
			 */
		});

		const expected = {
			'/hello': {
				post: {
					description: 'Post a "hello world" message.',
					requestBody: {
						description: 'A more complicated object.',
						required: true,
						content: {
							'application/x-www-form-urlencoded': {
								schema: {
									$ref: '#/components/schemas/ExampleObject',
								},
							},
							'application/json': {
								schema: {
									$ref: '#/components/schemas/ExampleObject',
								},
							},
							'image/png': {
								schema: {
									type: 'string',
									format: 'binary',
								},
							},
							'*/*': {
								schema: {
									type: 'string',
								},
							},
						},
					},
					responses: {
						'200': {
							description: 'hello world.',
							content: {
								'application/json': {
									description: 'A list of cars',
									schema: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Car',
										},
									},
									examples: {
										example1: {
											$ref: '#/components/examples/Example',
										},
									},
								},
							},
							headers: {
								'x-next': {
									description: 'A link to the next page of responses',
									schema: {
										type: 'string',
									},
								},
							},
						},
						'400': {
							description: 'error.',
							content: {
								'application/json': {
									description: 'error message',
									schema: {
										type: 'string',
									},
									examples: {
										example1: {
											$ref: '#/components/examples/Example',
										},
									},
								},
							},
							headers: {
								'fake-header': {
									description: 'A fake header',
									schema: {
										type: 'string',
									},
								},
							},
						},
					},
				},
			},
		};
		const { jsdoc } = parseApiFileContent(comment, undefined);
		const [specification] = filterJsDocComments(jsdoc);
		expect(specification).to.deep.equal(expected);
	});
});
