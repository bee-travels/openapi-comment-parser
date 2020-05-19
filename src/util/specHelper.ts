import { OpenApiSpec } from '../types';

function inject(swagger: OpenApiSpec, item: any) {
	Object.keys(item).forEach((key) => {
		if (key === 'components') {
			const components = Object.keys(item.components);

			if (swagger.components === undefined) {
				swagger.components = {};
			}

			components.forEach((name) => {
				swagger.components[name] = {
					...swagger.components[name],
					...item.components[name],
				};
			});
		} else if (key === 'paths') {
			const paths = Object.keys(item.paths);

			paths.forEach((name) => {
				swagger.paths[name] = {
					...swagger.paths[name],
					...item.paths[name],
				};
			});
		}
	});
}

export function addDataToSwaggerObject(
	swaggerObject: OpenApiSpec,
	items: any[]
) {
	items.forEach((item) => {
		inject(swaggerObject, item);
	});
}
