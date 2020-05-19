interface ParserOptions {
	definition: any;
	paths: string[];
}

interface OpenApiSpec {
	openapi: string;
	info: any;
	servers?: any[];
	paths: any;
	components?: any;
	security?: any[];
	tags?: any[];
	externalDocs?: any;
}
