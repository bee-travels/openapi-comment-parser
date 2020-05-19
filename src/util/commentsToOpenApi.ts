import parseComments from 'comment-parser';

const primitiveTypes = [
	'integer',
	'number',
	'string',
	'boolean',
	'object',
	'array',
];

const formatMap: { [key: string]: string } = {
	int32: 'integer',
	int64: 'integer',
	float: 'number',
	double: 'number',
	date: 'string',
	'date-time': 'string',
	password: 'string',
	byte: 'string',
	binary: 'string',
};

function parseDescription(tag: any) {
	const rawType = tag.type;
	const isArray = rawType && rawType.endsWith('[]');

	let parsedType;
	if (rawType) {
		parsedType = rawType.replace(/\[\]$/, '');
	}

	const isPrimitive = primitiveTypes.includes(parsedType);
	const isFormat = Object.keys(formatMap).includes(parsedType);

	let defaultValue;
	if (tag.default) {
		switch (parsedType) {
			case 'integer':
			case 'int32':
			case 'int64':
				defaultValue = parseInt(tag.default, 10);
				break;
			case 'number':
			case 'double':
			case 'float':
				defaultValue = parseFloat(tag.default);
				break;
			default:
				defaultValue = tag.default;
				break;
		}
	}

	let rootType;
	if (isPrimitive) {
		rootType = { type: parsedType, default: defaultValue };
	} else if (isFormat) {
		rootType = {
			type: formatMap[parsedType],
			format: parsedType,
			default: defaultValue,
		};
	} else {
		rootType = { $ref: `#/components/schemas/${parsedType}` };
	}

	let schema;
	if (isArray) {
		schema = {
			type: 'array',
			items: {
				...rootType,
			},
		};
	} else {
		schema = {
			...rootType,
		};
	}

	if (parsedType === undefined) {
		schema = undefined;
	}

	// remove the optional dash from the description.
	let description = tag.description.replace(/^- /, '');
	if (description === '') {
		description = undefined;
	}

	return {
		name: tag.name,
		description: description,
		required: !tag.optional,
		schema: schema,
		rawType: rawType,
	};
}

/**
 * Filters JSDoc comments for those tagged with '@swagger'
 * @function
 * @param {array} jsDocComments - JSDoc comments
 * @returns {array} JSDoc comments tagged with '@swagger'
 * @requires js-yaml
 */
function commentsToOpenApi(fileContents: string) {
	const openAPIRegex = /^(GET|PUT|POST|DELETE|OPTIONS|HEAD|PATCH|TRACE) \/.*$/;

	const jsDocComments = parseComments(fileContents);

	const filteredComments = jsDocComments
		.filter((comment) => openAPIRegex.test(comment.description))
		.map((comment) => {
			let docToJSON: any = {};
			const [_method, path] = comment.description.split(' ');
			const method = _method.toLowerCase();
			docToJSON[path] = {};
			docToJSON[path][method] = {};

			comment.tags.forEach((tag) => {
				const parsedResponse = parseDescription(tag);

				// Some ops only have a `description`, merge `name` and `description`
				// for these.
				let nameAndDescription = '';
				if (parsedResponse.name) {
					nameAndDescription += parsedResponse.name;
				}
				if (parsedResponse.description) {
					nameAndDescription += ` ${parsedResponse.description}`;
				}

				switch (tag.tag) {
					case 'operationId':
					case 'summary':
					case 'description':
						docToJSON[path][method][tag.tag] = nameAndDescription;
						break;
					case 'deprecated':
						docToJSON[path][method].deprecated = true;
						break;
					case 'externalDocs':
						docToJSON[path][method].externalDocs = {
							url: parsedResponse.name,
							description: parsedResponse.description,
						};
						break;
					case 'server':
						if (!docToJSON[path][method].servers) {
							docToJSON[path][method].servers = [];
						}
						docToJSON[path][method].servers.push({
							url: parsedResponse.name,
							description: parsedResponse.description,
						});
						break;
					case 'tag':
						if (!docToJSON[path][method].tags) {
							docToJSON[path][method].tags = [];
						}
						docToJSON[path][method].tags.push(nameAndDescription);
						break;
					case 'cookieParam':
					case 'headerParam':
					case 'queryParam':
					case 'pathParam':
						if (!docToJSON[path][method].parameters) {
							docToJSON[path][method].parameters = [];
						}
						docToJSON[path][method].parameters.push({
							name: parsedResponse.name,
							in: tag.tag.replace(/Param$/, ''),
							description: parsedResponse.description,
							required: parsedResponse.required,
							schema: parsedResponse.schema,
						});
						break;
					case 'bodyContent':
						if (!docToJSON[path][method].requestBody) {
							docToJSON[path][method].requestBody = {};
						}
						if (!docToJSON[path][method].requestBody.content) {
							docToJSON[path][method].requestBody.content = {};
						}
						docToJSON[path][method].requestBody = {
							...docToJSON[path][method].requestBody,
							content: {
								...docToJSON[path][method].requestBody.content,
								[parsedResponse.name.replace('*\\/*', '*/*')]: {
									schema: parsedResponse.schema,
								},
							},
						};
						break;
					case 'bodyDescription':
						if (!docToJSON[path][method].requestBody) {
							docToJSON[path][method].requestBody = {};
						}
						docToJSON[path][method].requestBody = {
							...docToJSON[path][method].requestBody,
							description: nameAndDescription,
						};
						break;
					case 'bodyRequired':
						if (!docToJSON[path][method].requestBody) {
							docToJSON[path][method].requestBody = {};
						}
						docToJSON[path][method].requestBody = {
							...docToJSON[path][method].requestBody,
							required: true,
						};
						break;
					case 'response':
						if (!docToJSON[path][method].responses) {
							docToJSON[path][method].responses = {};
						}
						docToJSON[path][method].responses[parsedResponse.name] = {
							...docToJSON[path][method].responses[parsedResponse.name],
							description: parsedResponse.description,
						};
						break;
					case 'callback':
						if (!docToJSON[path][method].callbacks) {
							docToJSON[path][method].callbacks = {};
						}
						docToJSON[path][method].callbacks[parsedResponse.name] = {
							$ref: `#/components/callbacks/${parsedResponse.rawType}`,
						};
						break;
					case 'responseContent':
						{
							const [status, contentType] = parsedResponse.name.split('.');
							if (!docToJSON[path][method].responses) {
								docToJSON[path][method].responses = {};
							}
							if (!docToJSON[path][method].responses[status]) {
								docToJSON[path][method].responses[status] = {};
							}
							docToJSON[path][method].responses[status].content = {
								...docToJSON[path][method].responses[status].content,
								[contentType]: {
									description: parsedResponse.description,
									schema: parsedResponse.schema,
								},
							};
						}
						break;
					case 'responseHeaderComponent':
						{
							const [status, headerName] = parsedResponse.name.split('.');
							if (!docToJSON[path][method].responses) {
								docToJSON[path][method].responses = {};
							}
							if (!docToJSON[path][method].responses[status]) {
								docToJSON[path][method].responses[status] = {};
							}
							docToJSON[path][method].responses[status].headers = {
								...docToJSON[path][method].responses[status].headers,
								[headerName]: {
									$ref: `#/components/headers/${parsedResponse.rawType}`,
								},
							};
						}
						break;
					case 'responseHeader':
						{
							const [status, headerName] = parsedResponse.name.split('.');
							if (!docToJSON[path][method].responses) {
								docToJSON[path][method].responses = {};
							}
							if (!docToJSON[path][method].responses[status]) {
								docToJSON[path][method].responses[status] = {};
							}
							docToJSON[path][method].responses[status].headers = {
								...docToJSON[path][method].responses[status].headers,
								[headerName]: {
									description: parsedResponse.description,
									schema: parsedResponse.schema,
								},
							};
						}
						break;
					case 'responseExample':
						{
							const [
								status,
								contentType,
								exampleName,
							] = parsedResponse.name.split('.');
							if (!docToJSON[path][method].responses) {
								docToJSON[path][method].responses = {};
							}
							if (!docToJSON[path][method].responses[status]) {
								docToJSON[path][method].responses[status] = {};
							}
							if (!docToJSON[path][method].responses[status].content) {
								docToJSON[path][method].responses[status].content = {};
							}
							if (
								!docToJSON[path][method].responses[status].content[contentType]
							) {
								docToJSON[path][method].responses[status].content[
									contentType
								] = {};
							}
							docToJSON[path][method].responses[status].content[
								contentType
							].examples = {
								...docToJSON[path][method].responses[status].content[
									contentType
								].examples,
								[exampleName]: {
									$ref: `#/components/examples/${parsedResponse.rawType}`,
								},
							};
						}
						break;
					case 'responseLink':
						{
							const [status, linkName] = parsedResponse.name.split('.');
							if (!docToJSON[path][method].responses) {
								docToJSON[path][method].responses = {};
							}
							if (!docToJSON[path][method].responses[status]) {
								docToJSON[path][method].responses[status] = {};
							}
							docToJSON[path][method].responses[status].links = {
								...docToJSON[path][method].responses[status].links,
								[linkName]: {
									$ref: `#/components/links/${parsedResponse.rawType}`,
								},
							};
						}
						break;
					case 'bodyComponent':
						docToJSON[path][method].requestBody = {
							$ref: `#/components/requestBodies/${parsedResponse.rawType}`,
						};
						break;
					case 'responseComponent':
						if (!docToJSON[path][method].responses) {
							docToJSON[path][method].responses = {};
						}
						docToJSON[path][method].responses[parsedResponse.name] = {
							$ref: `#/components/responses/${parsedResponse.rawType}`,
						};
						break;
					case 'paramComponent':
						if (!docToJSON[path][method].parameters) {
							docToJSON[path][method].parameters = [];
						}
						docToJSON[path][method].parameters.push({
							$ref: `#/components/parameters/${parsedResponse.rawType}`,
						});
						break;
					case 'security':
						{
							const [security, scopeItem] = parsedResponse.name.split('.');
							if (!docToJSON[path][method].security) {
								docToJSON[path][method].security = [];
							}

							let index = docToJSON[path][method].security.findIndex(
								(item: any) => item[security] !== undefined
							);

							if (index < 0) {
								docToJSON[path][method].security.push({ [security]: [] });
								index = 0;
							}

							if (scopeItem) {
								docToJSON[path][method].security[index][security].push(
									scopeItem
								);
							}
						}
						break;
					default:
						break;
				}
			});

			// Purge all undefined objects/arrays.
			return JSON.parse(JSON.stringify({ paths: docToJSON }));
		});
	return filteredComments;
}

export default commentsToOpenApi;
