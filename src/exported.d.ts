export interface ParserOptions {
	definition: BaseSpec;
	paths: string[];
}

export interface BaseSpec {
	openapi: string;
	info: any;
	servers?: any[];
	paths?: any;
	components?: any;
	security?: any[];
	tags?: any[];
	externalDocs?: any;
}

export interface OpenApiSpec {
	openapi: string;
	info: any;
	paths: any;
	servers?: any[];
	components?: any;
	security?: any[];
	tags?: any[];
	externalDocs?: any;
}

declare function parseComments({
	definition,
	paths,
}: ParserOptions): OpenApiSpec;
