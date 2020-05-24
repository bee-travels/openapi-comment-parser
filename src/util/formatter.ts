import chalk from 'chalk';

function pluralize(word: string, count: number) {
	return count === 1 ? word : `${word}s`;
}

function formatter(results: any[]) {
	let output = '\n';
	let errorCount = 0;
	let warningCount = 0;

	results.forEach((result) => {
		const messages = result.messages;

		if (messages.length === 0) {
			return;
		}

		output += `${chalk.underline(result.filePath)}\n`;

		const maxPositionWidth = messages.reduce((acc: number, message: any) => {
			const position = `${message.line || 0}:${message.column || 0}`;
			return Math.max(acc, position.length);
		}, 0);

		output += `${messages
			.map((message: any) => {
				let position = `${message.line || 0}:${message.column || 0}`;
				position += ' '.repeat(maxPositionWidth - position.length);
				let messageType;
				if (message.severity === 2) {
					messageType = chalk.red('error  ');
					errorCount++;
				} else {
					messageType = chalk.yellow('warning');
					warningCount++;
				}
				return `  ${chalk.dim(position)}  ${messageType}  ${message.message}`;
			})
			.join('\n')}\n\n`;
	});

	const total = errorCount + warningCount;

	const problems = `${total} ${pluralize('problem', total)}`;
	const errors = `${errorCount} ${pluralize('error', errorCount)}`;
	const warnings = `${warningCount} ${pluralize('warning', warningCount)}`;

	const summary = `\u2716 ${problems} (${errors}, ${warnings})`;

	if (errorCount > 0) {
		output += chalk.red.bold(summary);
	} else {
		output += chalk.yellow.bold(summary);
	}

	// Resets output color, for prevent change on top level
	return total > 0 ? chalk.reset(output) : '';
}

export default formatter;
