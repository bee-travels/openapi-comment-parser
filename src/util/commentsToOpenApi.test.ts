import chai, { expect } from 'chai';

import commentsToOpenApi from './commentsToOpenApi';

function _(func: { (): void }): string {
	const str = func.toString();
	return str
		.slice(str.indexOf('{') + 1, str.lastIndexOf('}'))
		.replace(/\r\n/g, '\n');
}

describe('commentsToOpenApi', () => {
	it('big stuff', () => {
		const comment = _(() => {
			/**
			 * POST /pet
			 *
			 * @externalDocs https://example.com - Find more info here
			 *
			 * @server https://development.gigantic-server.com/v1 - Development server
			 * @server https://gigantic-server.com/v1 - production server
			 *
			 * @paramComponent {ExampleParameter}
			 * @queryParam {ExampleSchema} [password] - username to fetch
			 * @queryParam {integer} [limit=20] - the limit to fetch
			 * @queryParam {number} [pi=3.14] - the limit to fetch
			 * @queryParam {string} [name=nick] - the limit to fetch
			 *
			 * @bodyDescription an optional description
			 * @bodyContent {string} application/json
			 * @bodyRequired
			 *
			 * @response                           200 - sup
			 * @responseContent   {string}         200.application/json
			 * @responseExample   {ExampleExample} 200.application/json.example1
			 * @responseExample   {ExampleExample} 200.application/json.example2
			 * @responseHeaderComponent {ExampleHeader}  200.some-header
			 * @responseHeaderComponent {ExampleHeader}  200.some-header2
			 * @responseLink      {ExampleLink}    200.some-link
			 * @responseLink      {ExampleLink}    200.some-link2
			 *
			 * @response 400 - :(
			 *
			 * @responseComponent {ExampleResponse} default
			 *
			 * @callback {ExampleCallback} onSomethin
			 * @callback {ExampleCallback} onSomethin2
			 *
			 * @security ExampleSecurity
			 * @security ExampleSecurity3
			 */
			/**
			 * PUT /pet
			 * @deprecated
			 * @bodyComponent {ExampleBody}
			 * @response 200 - fun
			 *
			 * @security ExampleSecurity2.write:pets
			 * @security ExampleSecurity2.read:pets
			 */
		});

		const expected1 = {
			paths: {
				'/pet': {
					post: {
						externalDocs: {
							description: 'Find more info here',
							url: 'https://example.com',
						},
						servers: [
							{
								description: 'Development server',
								url: 'https://development.gigantic-server.com/v1',
							},
							{
								description: 'production server',
								url: 'https://gigantic-server.com/v1',
							},
						],
						parameters: [
							{
								$ref: '#/components/parameters/ExampleParameter',
							},
							{
								name: 'password',
								in: 'query',
								description: 'username to fetch',
								required: false,
								schema: {
									$ref: '#/components/schemas/ExampleSchema',
								},
							},
							{
								name: 'limit',
								in: 'query',
								description: 'the limit to fetch',
								required: false,
								schema: {
									type: 'integer',
									default: 20,
								},
							},
							{
								name: 'pi',
								in: 'query',
								description: 'the limit to fetch',
								required: false,
								schema: {
									type: 'number',
									default: 3.14,
								},
							},
							{
								name: 'name',
								in: 'query',
								description: 'the limit to fetch',
								required: false,
								schema: {
									type: 'string',
									default: 'nick',
								},
							},
						],
						requestBody: {
							description: 'an optional description',
							required: true,
							content: {
								'application/json': {
									schema: {
										type: 'string',
									},
								},
							},
						},
						responses: {
							'200': {
								description: 'sup',
								content: {
									'application/json': {
										schema: {
											type: 'string',
										},
										examples: {
											example1: {
												$ref: '#/components/examples/ExampleExample',
											},
											example2: {
												$ref: '#/components/examples/ExampleExample',
											},
										},
									},
								},
								headers: {
									'some-header': {
										$ref: '#/components/headers/ExampleHeader',
									},
									'some-header2': {
										$ref: '#/components/headers/ExampleHeader',
									},
								},
								links: {
									'some-link': {
										$ref: '#/components/links/ExampleLink',
									},
									'some-link2': {
										$ref: '#/components/links/ExampleLink',
									},
								},
							},
							'400': {
								description: ':(',
							},
							default: {
								$ref: '#/components/responses/ExampleResponse',
							},
						},
						callbacks: {
							onSomethin: {
								$ref: '#/components/callbacks/ExampleCallback',
							},
							onSomethin2: {
								$ref: '#/components/callbacks/ExampleCallback',
							},
						},
						security: [
							{
								ExampleSecurity: [],
							},
							{
								ExampleSecurity3: [],
							},
						],
					},
				},
			},
		};

		const expected2 = {
			paths: {
				'/pet': {
					put: {
						deprecated: true,
						requestBody: {
							$ref: '#/components/requestBodies/ExampleBody',
						},
						responses: {
							'200': {
								description: 'fun',
							},
						},
						security: [
							{
								ExampleSecurity2: ['write:pets', 'read:pets'],
							},
						],
					},
				},
			},
		};
		const specification = commentsToOpenApi(comment).map((i) => i.spec);
		expect(specification).to.deep.equal([expected1, expected2]);
	});

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
			paths: {
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
			},
		};
		const [specification] = commentsToOpenApi(comment).map((i) => i.spec);
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
			paths: {
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
			},
		};
		const [specification] = commentsToOpenApi(comment).map((i) => i.spec);
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
			paths: {
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
			},
		};

		const expected2 = {
			paths: {
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
			},
		};

		const specification = commentsToOpenApi(comment).map((i) => i.spec);
		expect(specification).to.deep.equal([expected1, expected2]);
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
			paths: {
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
			},
		};
		const [specification] = commentsToOpenApi(comment).map((i) => i.spec);
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
			paths: {
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
			},
		};
		const [specification] = commentsToOpenApi(comment).map((i) => i.spec);
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
			paths: {
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
			},
		};
		const [specification] = commentsToOpenApi(comment).map((i) => i.spec);
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
			 * @responseContent {Car[]} 200.application/json
			 * @responseHeader {string} 200.x-next - A link to the next page of responses
			 * @responseExample {Example} 200.application/json.example1
			 * @responseContent {string} 400.application/json
			 * @responseHeader {string} 400.fake-header - A fake header
			 * @responseExample {Example} 400.application/json.example1
			 * @response 400 - error.
			 */
		});

		const expected = {
			paths: {
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
			},
		};
		const [specification] = commentsToOpenApi(comment).map((i) => i.spec);
		expect(specification).to.deep.equal(expected);
	});

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
			paths: {
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
			},
		};
		const [specification] = commentsToOpenApi(comment).map((i) => i.spec);
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
			paths: {
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
			},
		};
		const [specification] = commentsToOpenApi(comment).map((i) => i.spec);
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
			paths: {
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
			},
		};
		const [specification] = commentsToOpenApi(comment).map((i) => i.spec);
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
			paths: {
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
			},
		};

		const expected2 = {
			paths: {
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
			},
		};

		const expected3 = {
			paths: {
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
			},
		};
		const specification = commentsToOpenApi(comment).map((i) => i.spec);
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
			paths: {
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
			},
		};
		const [specification] = commentsToOpenApi(comment).map((i) => i.spec);
		expect(specification).to.deep.equal(expected);
	});

	it('does nothing for normal comment', () => {
		const comment = _(() => {
			/**
			 * normal comment
			 */
		});

		const specification = commentsToOpenApi(comment).map((i) => i.spec);
		expect(specification).to.have.lengthOf(0);
	});
});
