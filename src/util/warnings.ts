export const yamlParseError = (file: string, message: string) => {
	console.warn(`warning: Failed to parse "${file}".`);
	console.warn(message);
};

export const nonJavascriptFileWarning = (file: string, ext: string) => {
	console.warn(
		`warning: Attempting to parse "${file}" with extension "${ext}". `
	);
	console.warn(`Expected ".js" or ".ts".`);
};
