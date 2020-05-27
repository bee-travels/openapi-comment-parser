export interface ParserOptions {
	cwd?: string;
	extension?: string[];
	include?: string[];
	exclude?: string[];
	excludeNodeModules?: boolean;
	verbose?: boolean;
	throwLevel?: string;
}

export interface BaseDefinition {
	openapi: string;
	info: InfoObject;
	servers?: ServerObject[];
	paths?: PathsObject;
	components?: ComponentsObject;
	security?: SecurityRequirementObject[];
	tags?: TagObject[];
	externalDocs?: ExternalDocumentationObject;
}

export interface OpenApiObject extends BaseDefinition {
	paths: PathsObject;
}

export interface InfoObject {
	title: string;
	version: string;
	description?: string;
	termsOfService?: string;
	contact?: ContactObject;
	license?: LicenseObject;
}

export interface ContactObject {
	name?: string;
	url?: string;
	email?: string;
}

export interface LicenseObject {
	name: string;
	url?: string;
}

export interface ServerObject {
	url: string;
	description?: string;
	variables?: Map<ServerVariable>;
}

export interface ServerVariable {
	default: string;
	enum?: string[];
	description?: string;
}

export interface ComponentsObject {
	schemas?: Map<SchemaObject | ReferenceObject>;
	responses?: Map<ResponseObject | ReferenceObject>;
	parameters?: Map<ParameterObject | ReferenceObject>;
	examples?: Map<ExampleObject | ReferenceObject>;
	requestBodies?: Map<RequestBodyObject | ReferenceObject>;
	headers?: Map<HeaderObject | ReferenceObject>;
	securitySchemes?: Map<
		| ApiKeySecuritySchemeObject
		| HttpSecuritySchemeObject
		| Oauth2SecuritySchemeObject
		| OpenIdConnectSecuritySchemeObject
		| ReferenceObject
	>;
	links?: Map<LinkObject | ReferenceObject>;
	callbacks?: Map<CallbackObject | ReferenceObject>;
}

export interface PathsObject {
	[path: string]: PathItemObject;
}

export interface PathItemObject {
	$ref?: string;
	summary?: string;
	description?: string;
	get?: OperationObject;
	put?: OperationObject;
	post?: OperationObject;
	delete?: OperationObject;
	options?: OperationObject;
	head?: OperationObject;
	patch?: OperationObject;
	trace?: OperationObject;
	servers?: ServerObject[];
	parameters?: (ParameterObject | ReferenceObject)[];
}

export interface OperationObject {
	responses: ResponsesObject;
	tags?: string[];
	summary?: string;
	description?: string;
	externalDocs?: ExternalDocumentationObject;
	operationId?: string;
	parameters?: (ParameterObject | ReferenceObject)[];
	requestBody?: RequestBodyObject | ReferenceObject;
	callbacks?: Map<CallbackObject | ReferenceObject>;
	deprecated?: boolean;
	security?: SecurityRequirementObject[];
	servers?: ServerObject[];
}

export interface ExternalDocumentationObject {
	url: string;
	description?: string;
}

export interface ParameterObject {
	name: string;
	in: string;
	description?: string;
	required?: boolean;
	deprecated?: boolean;
	allowEmptyValue?: boolean;
	//
	style?: string;
	explode?: string;
	allowReserved?: boolean;
	schema?: SchemaObject | ReferenceObject;
	example?: any;
	examples?: Map<ExampleObject | ReferenceObject>;
	//
	content?: Map<MediaTypeObject>;
	// ignoring stylings: matrix, label, form, simple, spaceDelimited,
	// pipeDelimited and deepObject
}

export interface RequestBodyObject {
	content: Map<MediaTypeObject>;
	description?: string;
	required?: boolean;
}

export interface MediaTypeObject {
	schema?: SchemaObject | ReferenceObject;
	example?: any;
	examples?: Map<ExampleObject | ReferenceObject>;
	encoding?: Map<EncodingObject>;
}

export interface EncodingObject {
	contentType?: string;
	headers?: Map<HeaderObject | ReferenceObject>;
	style?: string;
	explode?: boolean;
	allowReserved?: boolean;
}

export interface ResponsesObject {
	[code: string]: ResponseObject | ReferenceObject;
}

export interface ResponseObject {
	description: string;
	headers?: Map<HeaderObject | ReferenceObject>;
	content?: Map<MediaTypeObject>;
	links?: Map<LinkObject | ReferenceObject>;
}

export interface CallbackObject {
	[expression: string]: PathItemObject;
}

export interface ExampleObject {
	summary?: string;
	description?: string;
	value?: any;
	externalValue?: string;
}

export interface LinkObject {
	operationRef?: string;
	operationId?: string;
	parameters?: Map<any>;
	requestBody?: any;
	description?: string;
	server?: ServerObject;
}

export interface HeaderObject {
	description?: string;
	required?: boolean;
	deprecated?: boolean;
	allowEmptyValue?: boolean;
	//
	style?: string;
	explode?: string;
	allowReserved?: boolean;
	schema?: SchemaObject | ReferenceObject;
	example?: any;
	examples?: Map<ExampleObject | ReferenceObject>;
	//
	content?: Map<MediaTypeObject>;
	// ignoring stylings: matrix, label, form, simple, spaceDelimited,
	// pipeDelimited and deepObject
}

export interface TagObject {
	name: string;
	description?: string;
	externalDocs?: ExternalDocumentationObject;
}

export interface ReferenceObject {
	$ref: string;
}

// TODO: this could be expanded on.
export interface SchemaObject {
	[key: string]: any;
}

export interface ApiKeySecuritySchemeObject {
	type: string;
	description?: string;
	name: string;
	in: string;
}

export interface HttpSecuritySchemeObject {
	type: string;
	description?: string;
	scheme: string;
	bearerFormat?: string;
}

export interface Oauth2SecuritySchemeObject {
	type: string;
	description?: string;
	flows: OAuthFlowsObject;
}

export interface OpenIdConnectSecuritySchemeObject {
	type: string;
	description?: string;
	openIdConnectUrl: string;
}

export interface OAuthFlowsObject {
	implicit?: OAuthFlowObject;
	password?: OAuthFlowObject;
	clientCredentials?: OAuthFlowObject;
	authorizationCode?: OAuthFlowObject;
}

export interface OAuthFlowObject {
	authorizationUrl?: string; // required for some?
	tokenUrl?: string; // required for some?
	refreshUrl: string;
	scopes: Map<string>;
}

export interface SecurityRequirementObject {
	[name: string]: string[];
}

export interface Map<T> {
	[key: string]: T;
}

declare function openapi(options?: ParserOptions): OpenApiObject;

export default openapi;
