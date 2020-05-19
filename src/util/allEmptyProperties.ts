function allEmptyProperties(obj: Object): boolean {
	return Object.values(obj).every(
		(value) => typeof value === 'object' && Object.keys(value).length === 0
	);
}

export default allEmptyProperties;
