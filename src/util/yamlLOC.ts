function yamlLOC(string: string): number {
	// Break string into lines.
	const split = string.split(/\r\n|\r|\n/);
	const filtered = split.filter((line) => {
		// Remove comments.
		if (/^\s*([#]\s*.*)?$/.test(line)) {
			return false;
		}
		// Remove empty lines.
		return line.trim().length > 0;
	});
	const loc = filtered.length;
	return loc;
}

export default yamlLOC;
