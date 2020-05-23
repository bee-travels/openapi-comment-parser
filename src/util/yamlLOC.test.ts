import { expect } from 'chai';

import yamlLOC from './yamlLOC';

describe('yamlLOC', () => {
	it('handles simplest case', () => {
		const yaml = `
    simple:
      example: "hi"
    `;
		const count = yamlLOC(yaml);
		expect(count).to.equal(2);
	});

	it('strips newlines', () => {
		const yaml = `
    simple1:
      example: "hi"

    simple2:
      example: "hi"
    `;
		const count = yamlLOC(yaml);
		expect(count).to.equal(4);
	});

	it('strips comments', () => {
		const yaml = `
    # a comment
    simple1:
      example: "hi"

    #a comment
    simple2:
      example: "hi"
    `;
		const count = yamlLOC(yaml);
		expect(count).to.equal(4);
	});

	it('strips indented comments', () => {
		const yaml = `
    simple:
      #a comment
      example: "hi"
    `;
		const count = yamlLOC(yaml);
		expect(count).to.equal(2);
	});

	it("doesn't strip inline comments", () => {
		const yaml = `
    simple: # a comment
      example: "hi"
    `;
		const count = yamlLOC(yaml);
		expect(count).to.equal(2);
	});

	it("doesn't strip components string", () => {
		const yaml = `
    simple:
      example: "#/components/one/hi"
    `;
		const count = yamlLOC(yaml);
		expect(count).to.equal(2);
	});
});
