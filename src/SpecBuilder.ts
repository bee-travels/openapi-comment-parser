import * as specHelper from './util/specHelper';
import { BaseSpec, OpenApiSpec } from './types';

class SpecBuilder implements OpenApiSpec {
	openapi: string;
	info: any;
	paths: any;
	components?: any;
	externalDocs?: any;
	servers?: any[];
	security?: any[];
	tags?: any[];

	constructor(baseDefinition: BaseSpec) {
		this.openapi = baseDefinition.openapi;
		this.paths = baseDefinition.paths || {};
		this.components = baseDefinition.components;
		this.externalDocs = baseDefinition.externalDocs;
		this.servers = baseDefinition.servers;
		this.security = baseDefinition.security;
		this.tags = baseDefinition.tags;
	}

	addData(parsedFile: any[]) {
		specHelper.addDataToSwaggerObject(this, parsedFile);
	}
}

export default SpecBuilder;
