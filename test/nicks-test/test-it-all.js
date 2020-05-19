/* global it, describe */

const chai = require('chai');

const _ = require('../commentToString');

const {
  filterJsDocComments,
  parseApiFileContent,
} = require('../../dist/openapi-comment-parser');

const { expect } = chai;

describe('all of it', () => {
  it('big stuff', () => {
    const comment = _(() => {
      /**
       * POST /pet
       *
       * @externalDocs https://example.com - Find more info here
       *
       * @server https://development.gigantic-server.com/v1 - Development server
       * @server https://gigantic-server.com/v1 - production server
       *
       * @paramComponent {ExampleParameter}
       * @queryParam {ExampleSchema} [password] - username to fetch
       * @queryParam {integer} [limit=20] - the limit to fetch
       * @queryParam {number} [pi=3.14] - the limit to fetch
       * @queryParam {string} [name=nick] - the limit to fetch
       *
       * @bodyDescription an optional description
       * @bodyContent {string} application/json
       * @bodyRequired
       *
       * @response                           200 - sup
       * @responseContent   {string}         200.application/json
       * @responseExample   {ExampleExample} 200.application/json.example1
       * @responseExample   {ExampleExample} 200.application/json.example2
       * @responseHeaderComponent {ExampleHeader}  200.some-header
       * @responseHeaderComponent {ExampleHeader}  200.some-header2
       * @responseLink      {ExampleLink}    200.some-link
       * @responseLink      {ExampleLink}    200.some-link2
       *
       * @response 400 - :(
       *
       * @responseComponent {ExampleResponse} default
       *
       * @callback {ExampleCallback} onSomethin
       * @callback {ExampleCallback} onSomethin2
       *
       * @security ExampleSecurity
       * @security ExampleSecurity3
       */
      /**
       * PUT /pet
       * @deprecated
       * @bodyComponent {ExampleBody}
       * @response 200 - fun
       *
       * @security ExampleSecurity2.write:pets
       * @security ExampleSecurity2.read:pets
       */
    });

    const expected1 = {
      '/pet': {
        post: {
          externalDocs: {
            description: 'Find more info here',
            url: 'https://example.com',
          },
          servers: [
            {
              description: 'Development server',
              url: 'https://development.gigantic-server.com/v1',
            },
            {
              description: 'production server',
              url: 'https://gigantic-server.com/v1',
            },
          ],
          parameters: [
            {
              $ref: '#/components/parameters/ExampleParameter',
            },
            {
              name: 'password',
              in: 'query',
              description: 'username to fetch',
              required: false,
              schema: {
                $ref: '#/components/schemas/ExampleSchema',
              },
            },
            {
              name: 'limit',
              in: 'query',
              description: 'the limit to fetch',
              required: false,
              schema: {
                type: 'integer',
                default: 20,
              },
            },
            {
              name: 'pi',
              in: 'query',
              description: 'the limit to fetch',
              required: false,
              schema: {
                type: 'number',
                default: 3.14,
              },
            },
            {
              name: 'name',
              in: 'query',
              description: 'the limit to fetch',
              required: false,
              schema: {
                type: 'string',
                default: 'nick',
              },
            },
          ],
          requestBody: {
            description: 'an optional description',
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'sup',
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                  examples: {
                    example1: {
                      $ref: '#/components/examples/ExampleExample',
                    },
                    example2: {
                      $ref: '#/components/examples/ExampleExample',
                    },
                  },
                },
              },
              headers: {
                'some-header': {
                  $ref: '#/components/headers/ExampleHeader',
                },
                'some-header2': {
                  $ref: '#/components/headers/ExampleHeader',
                },
              },
              links: {
                'some-link': {
                  $ref: '#/components/links/ExampleLink',
                },
                'some-link2': {
                  $ref: '#/components/links/ExampleLink',
                },
              },
            },
            '400': {
              description: ':(',
            },
            default: {
              $ref: '#/components/responses/ExampleResponse',
            },
          },
          callbacks: {
            onSomethin: {
              $ref: '#/components/callbacks/ExampleCallback',
            },
            onSomethin2: {
              $ref: '#/components/callbacks/ExampleCallback',
            },
          },
          security: [
            {
              ExampleSecurity: [],
            },
            {
              ExampleSecurity3: [],
            },
          ],
        },
      },
    };

    const expected2 = {
      '/pet': {
        put: {
          deprecated: true,
          requestBody: {
            $ref: '#/components/requestBodies/ExampleBody',
          },
          responses: {
            '200': {
              description: 'fun',
            },
          },
          security: [
            {
              ExampleSecurity2: ['write:pets', 'read:pets'],
            },
          ],
        },
      },
    };
    const { jsdoc } = parseApiFileContent(comment);
    const specification = filterJsDocComments(jsdoc);
    expect(specification).to.deep.equal([expected1, expected2]);
  });
});
