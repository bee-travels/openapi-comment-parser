/* global it, describe */

import { expect } from 'chai';

import _ from '../commentToString';

import filterJsDocComments from '../../src/helpers/filterJsDocComments';
import parseApiFileContent from '../../src/helpers/parseApiFileContent';

describe('open-api-examples', () => {
	it('api-with-examples', () => {
		const comment = _(() => {
			/**
			 * GET /
			 * @operationId listVersionsv2
			 * @summary List API versions
			 * @response 200 - 200 response
			 * @responseContent 200.application/json
			 * @responseExample {Foo} 200.application/json.foo
			 * @response 300 - 300 response
			 * @responseContent 300.application/json
			 * @responseExample {Foo} 300.application/json.foo
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
							content: {
								'application/json': {
									examples: {
										foo: {
											$ref: '#/components/examples/Foo',
										},
									},
								},
							},
						},
						'300': {
							description: '300 response',
							content: {
								'application/json': {
									examples: {
										foo: {
											$ref: '#/components/examples/Foo',
										},
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

	it('callback', () => {
		const comment = _(() => {
			/**
			 * POST /streams
			 * @description subscribes a client to receive out-of-band data
			 * @queryParam {uri} callbackUrl - the location where data will be sent.  Must be network accessible
			 * by the source server
			 * @response 201 - subscription successfully created
			 * @responseContent {Custom} 201.application/json
			 * @callback {Callback} onData
			 */
		});

		const expected = {
			'/streams': {
				post: {
					description: 'subscribes a client to receive out-of-band data',
					parameters: [
						{
							name: 'callbackUrl',
							in: 'query',
							required: true,
							description:
								'the location where data will be sent.  Must be network accessible\nby the source server',
							schema: {
								$ref: '#/components/schemas/uri',
							},
						},
					],
					responses: {
						'201': {
							description: 'subscription successfully created',
							content: {
								'application/json': {
									schema: {
										$ref: '#/components/schemas/Custom',
									},
								},
							},
						},
					},
					callbacks: {
						onData: {
							$ref: '#/components/callbacks/Callback',
						},
					},
				},
			},
		};
		const { jsdoc } = parseApiFileContent(comment, undefined);
		const [specification] = filterJsDocComments(jsdoc);
		expect(specification).to.deep.equal(expected);
	});

	it('links', () => {
		const comment = _(() => {
			/**
			 * GET /users/{username}
			 * @operationId getUserByName
			 * @pathParam {string} username
			 * @response 200 - The User
			 * @responseContent {User} 200.application/json
			 * @responseLink {UserRepositories} 200.userRepositories
			 */
		});

		const expected = {
			'/users/{username}': {
				get: {
					operationId: 'getUserByName',
					parameters: [
						{
							name: 'username',
							in: 'path',
							required: true,
							schema: {
								type: 'string',
							},
						},
					],
					responses: {
						'200': {
							description: 'The User',
							content: {
								'application/json': {
									schema: {
										$ref: '#/components/schemas/User',
									},
								},
							},
							links: {
								userRepositories: {
									$ref: '#/components/links/UserRepositories',
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

	it('petstore', () => {
		const comment = _(() => {
			/**
			 * GET /pets
			 * @summary List all pets
			 * @operationId listPets
			 * @tag pets
			 * @queryParam {int32} [limit] - How many items to return at one time (max 100)
			 * @response 200 - A paged array of pets
			 * @responseHeader {string} 200.x-next - A link to the next page of responses
			 * @responseContent {Pets} 200.application/json
			 * @response default - unexpected error
			 * @responseContent {Error} default.application/json
			 */
			/**
			 * POST /pets
			 * @summary Create a pet
			 * @operationId createPets
			 * @tag pets
			 * @response 201 - Null response
			 * @response default - unexpected error
			 * @responseContent {Error} default.application/json
			 */
			/**
			 * GET /pets/{petId}
			 * @summary Info for a specific pet
			 * @operationId showPetById
			 * @tag pets
			 * @tag another tag with space
			 * @pathParam {string} petId - The id of the pet to retrieve
			 * @response 200 - Expected response to a valid request
			 * @responseContent {Pets} 200.application/json
			 * @response default - unexpected error
			 * @responseContent {Error} default.application/json
			 */
		});

		const expected1 = {
			'/pets': {
				get: {
					summary: 'List all pets',
					operationId: 'listPets',
					tags: ['pets'],
					parameters: [
						{
							name: 'limit',
							in: 'query',
							description: 'How many items to return at one time (max 100)',
							required: false,
							schema: {
								type: 'integer',
								format: 'int32',
							},
						},
					],
					responses: {
						'200': {
							description: 'A paged array of pets',
							headers: {
								'x-next': {
									description: 'A link to the next page of responses',
									schema: {
										type: 'string',
									},
								},
							},
							content: {
								'application/json': {
									schema: {
										$ref: '#/components/schemas/Pets',
									},
								},
							},
						},
						default: {
							description: 'unexpected error',
							content: {
								'application/json': {
									schema: {
										$ref: '#/components/schemas/Error',
									},
								},
							},
						},
					},
				},
			},
		};

		const expected2 = {
			'/pets': {
				post: {
					summary: 'Create a pet',
					operationId: 'createPets',
					tags: ['pets'],
					responses: {
						'201': {
							description: 'Null response',
						},
						default: {
							description: 'unexpected error',
							content: {
								'application/json': {
									schema: {
										$ref: '#/components/schemas/Error',
									},
								},
							},
						},
					},
				},
			},
		};

		const expected3 = {
			'/pets/{petId}': {
				get: {
					summary: 'Info for a specific pet',
					operationId: 'showPetById',
					tags: ['pets', 'another tag with space'],
					parameters: [
						{
							name: 'petId',
							in: 'path',
							required: true,
							description: 'The id of the pet to retrieve',
							schema: {
								type: 'string',
							},
						},
					],
					responses: {
						'200': {
							description: 'Expected response to a valid request',
							content: {
								'application/json': {
									schema: {
										$ref: '#/components/schemas/Pets',
									},
								},
							},
						},
						default: {
							description: 'unexpected error',
							content: {
								'application/json': {
									schema: {
										$ref: '#/components/schemas/Error',
									},
								},
							},
						},
					},
				},
			},
		};
		const { jsdoc } = parseApiFileContent(comment, undefined);
		const specification = filterJsDocComments(jsdoc);
		expect(specification).to.deep.equal([expected1, expected2, expected3]);
	});

	it('multiple response content types', () => {
		const comment = _(() => {
			/**
			 * GET /
			 * @response 200 - OK
			 * @responseContent {Pet} 200.application/json
			 * @responseContent {Pet} 200.application/xml
			 */
		});

		const expected = {
			'/': {
				get: {
					responses: {
						'200': {
							description: 'OK',
							content: {
								'application/json': {
									schema: {
										$ref: '#/components/schemas/Pet',
									},
								},
								'application/xml': {
									schema: {
										$ref: '#/components/schemas/Pet',
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
