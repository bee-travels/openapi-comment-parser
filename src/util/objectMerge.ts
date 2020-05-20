function objectMerge<T>(a: T, b: T) {
	for (const key in b) {
		if (a[key] === undefined) {
			a[key] = {
				...b[key],
			};
		} else {
			for (const key2 in b[key]) {
				a[key][key2] = {
					...a[key][key2],
					...b[key][key2],
				};
			}
		}
	}
}

export default objectMerge;
