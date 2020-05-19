/* global it, describe */

const chai = require('chai');

const { expect } = chai;

const swaggerJsdoc = require('../../../dist/openapi-comment-parser');

const referenceSpecification = require('./openapi.json');

const definition = {
  openapi: '3.0.0',
  info: {
    title: 'title',
    version: '1.0.0',
  },
};

describe('OpenAPI examples', () => {
  it('works', () => {
    const options = {
      definition,
      apis: [`./test/example/v3/api.js`],
    };

    const specification = swaggerJsdoc(options);
    expect(specification).to.deep.equal(referenceSpecification);
  });
});
