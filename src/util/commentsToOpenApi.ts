import parseComments from 'comment-parser';
import { OpenApiObject, PathsObject } from '../exported';

import merge from 'lodash/mergeWith';
import isArray from 'lodash/isArray';

function customizer(objValue: any, srcValue: any) {
	if (isArray(objValue)) {
		return objValue.concat(srcValue);
	}
}

// The security object has a bizare setup...
function fixSecurityObject(thing: any) {
	if (thing.security) {
		const newSecurity = Object.keys(thing.security).map((s) => ({
			[s]: thing.security[s],
		}));
		thing.security = newSecurity;
	}
}

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

function tagsToObjects(tags: any[], verbose?: boolean) {
	return tags.map((tag) => {
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
				return { [tag.tag]: nameAndDescription };

			case 'deprecated':
				return { deprecated: true };

			case 'externalDocs':
				return {
					externalDocs: {
						url: parsedResponse.name,
						description: parsedResponse.description,
					},
				};

			case 'server':
				return {
					servers: [
						{
							url: parsedResponse.name,
							description: parsedResponse.description,
						},
					],
				};

			case 'tag':
				return { tags: [nameAndDescription] };

			case 'cookieParam':
			case 'headerParam':
			case 'queryParam':
			case 'pathParam':
				return {
					parameters: [
						{
							name: parsedResponse.name,
							in: tag.tag.replace(/Param$/, ''),
							description: parsedResponse.description,
							required: parsedResponse.required,
							schema: parsedResponse.schema,
						},
					],
				};

			case 'bodyContent':
				return {
					requestBody: {
						content: {
							[parsedResponse.name.replace('*\\/*', '*/*')]: {
								schema: parsedResponse.schema,
							},
						},
					},
				};

			case 'bodyDescription':
				return { requestBody: { description: nameAndDescription } };

			case 'bodyRequired':
				return { requestBody: { required: true } };

			case 'response':
				return {
					responses: {
						[parsedResponse.name]: {
							description: parsedResponse.description,
						},
					},
				};

			case 'callback':
				return {
					callbacks: {
						[parsedResponse.name]: {
							$ref: `#/components/callbacks/${parsedResponse.rawType}`,
						},
					},
				};

			case 'responseContent': {
				const [status, contentType] = parsedResponse.name.split('.');

				return {
					responses: {
						[status]: {
							content: {
								[contentType]: {
									schema: parsedResponse.schema,
								},
							},
						},
					},
				};
			}

			case 'responseHeaderComponent': {
				const [status, header] = parsedResponse.name.split('.');
				return {
					responses: {
						[status]: {
							headers: {
								[header]: {
									$ref: `#/components/headers/${parsedResponse.rawType}`,
								},
							},
						},
					},
				};
			}

			case 'responseHeader': {
				const [status, header] = parsedResponse.name.split('.');
				return {
					responses: {
						[status]: {
							headers: {
								[header]: {
									description: parsedResponse.description,
									schema: parsedResponse.schema,
								},
							},
						},
					},
				};
			}

			case 'responseExample': {
				const [status, contentType, example] = parsedResponse.name.split('.');
				return {
					responses: {
						[status]: {
							content: {
								[contentType]: {
									examples: {
										[example]: {
											$ref: `#/components/examples/${parsedResponse.rawType}`,
										},
									},
								},
							},
						},
					},
				};
			}

			case 'responseLink': {
				const [status, link] = parsedResponse.name.split('.');
				return {
					responses: {
						[status]: {
							links: {
								[link]: {
									$ref: `#/components/links/${parsedResponse.rawType}`,
								},
							},
						},
					},
				};
			}

			case 'bodyComponent':
				return {
					requestBody: {
						$ref: `#/components/requestBodies/${parsedResponse.rawType}`,
					},
				};

			case 'responseComponent':
				return {
					responses: {
						[parsedResponse.name]: {
							$ref: `#/components/responses/${parsedResponse.rawType}`,
						},
					},
				};

			case 'paramComponent':
				return {
					parameters: [
						{ $ref: `#/components/parameters/${parsedResponse.rawType}` },
					],
				};

			case 'security': {
				const [security, scopeItem] = parsedResponse.name.split('.');
				let scope: string[] = [];
				if (scopeItem) {
					scope = [scopeItem];
				}
				return {
					security: { [security]: scope },
				};
			}

			default: {
				return {};
			}
		}
	});
}

function commentsToOpenApi(
	fileContents: string,
	verbose?: boolean
): { spec: OpenApiObject; loc: number }[] {
	const openAPIRegex = /^(GET|PUT|POST|DELETE|OPTIONS|HEAD|PATCH|TRACE) \/.*$/;

	const jsDocComments = parseComments(fileContents);

	const filteredComments = jsDocComments
		.filter((comment) => {
			const validComment = openAPIRegex.test(comment.description);

			return validComment;
		})
		.map((comment) => {
			// Line count, number of tags + 1 for description.
			// - Don't count line-breaking due to long descriptions
			// - Don't count empty lines
			const loc = comment.tags.length + 1;

			const objects = tagsToObjects(comment.tags, verbose);

			const res = merge({}, ...objects, customizer);

			fixSecurityObject(res);

			const [method, path] = comment.description.split(' ');

			const pathsObject: PathsObject = {
				[path]: {
					[method.toLowerCase()]: {
						...res,
					},
				},
			};

			// Purge all undefined objects/arrays.
			const spec = JSON.parse(JSON.stringify({ paths: pathsObject }));
			return {
				spec: spec,
				loc: loc,
			};
		});
	return filteredComments;
}

export default commentsToOpenApi;
