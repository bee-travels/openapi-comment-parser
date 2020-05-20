# OpenAPI Comment Parser
[![npm Version](https://img.shields.io/npm/v/openapi-comment-parser.svg)](https://www.npmjs.com/package/openapi-comment-parser)
[![npm Downloads](https://img.shields.io/npm/dw/openapi-comment-parser.svg)](https://www.npmjs.com/package/openapi-comment-parser)
[![npm Downloads](https://badgen.net/bundlephobia/minzip/openapi-comment-parser)](https://bundlephobia.com/result?p=openapi-comment-parser)


A clean and simple way to document your code for generating OpenAPI (Swagger) specs.

## Goal

![goal](/assets/openapi-comment-parser.png)

## Installation

```bash
$ npm install openapi-comment-parser --save
```

or

```bash
$ yarn add openapi-comment-parser
```

## Usage

```js
const parseComments = require('openapi-comment-parser');

// normal OpenAPI definition
const baseDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Title of your service',
    version: '1.0.0',
  },
};

const spec = parseComments({
  definition: baseDefinition,
  paths: ['src/**/*.js'], // paths to files with comments to be parsed
});
```

### Swagger UI Express example

```js
const path = require('path');
const commentParser = require('openapi-comment-parser');
const swaggerUi = require('swagger-ui-express');

const spec = parseComments({
  definition: baseDefinition,
  paths: [path.join(__dirname, '**/*.?(js|yaml|yml)')],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
```

## Basic structure
You can write OpenAPI definitions in JSDoc comments or YAML files.
In this guide, we use only JSDoc comments examples but YAML files works equally well.

Each comment defines individual endpoints (paths) in your API, and the HTTP methods (operations) supported by these endpoints.
For example, `GET /users` can be described as:

```js
/**
 * GET /users
 * @summary Returns a list of users.
 * @description Optional extended description in CommonMark or HTML.
 * @response 200 - A JSON array of user names
 * @responseContent {string[]} 200.application/json
 */
```

### Parameters
Operations can have parameters passed via URL path (`/users/{userId}`), query string (`/users?role=admin`),
headers (`X-CustomHeader: Value`) or cookies (`Cookie: debug=0`).
You can define the parameter data types, format, whether they are required or optional, and other details:

```js
/**
 * GET /users/{userId}
 * @summary Returns a user by ID.
 * @pathParam {int64} userId - Parameter description in CommonMark or HTML.
 * @response 200 - OK
 */
```

For more information, see [Describing Parameters](/docs/describing-parameters.md).

### Request body
If an operation sends a request body, use the `bodyContent` keyword to describe the body content and media type.
Use `bodyRequired` to indicate that a request body is required.

```js
/**
 * POST /users
 * @summary Creates a user.
 * @bodyContent {User} application/json
 * @bodyRequired
 * @response 201 - Created
 */
```

For more information, see [Describing Request Body](/docs/describing-request-body.md).

### Responses
For each operation, you can define possible status codes, such as 200 OK or 404 Not Found, and the response body content.
You can also provide example responses for different content types:

```js
/**
 * GET /users/{userId}
 * @summary Returns a user by ID.
 * @pathParam {int64} userId - The ID of the user to return.
 * @response 200 - A user object.
 * @responseContent {User} 200.application/json
 * @response 400 - The specified user ID is invalid (not a number).
 * @response 404 - A user with the specified ID was not found.
 * @response default - Unexpected error
 */
```

For more information, see [Describing Responses](/docs/describing-responses.md).

### Input and output models
You can create global `components/schemas` section lets you define common data structures used in your API.
They can be referenced by name whenever a schema is required – in parameters, request bodies, and response bodies.
For example, this JSON object:

```json
{
  "id": 4,
  "name": "Arthur Dent"
}
```

can be represented as:

```yaml
components:
  schemas:
    User:
      properties:
        id:
          type: integer
        name:
          type: string
      # Both properties are required
      required:  
        - id
        - name
```

and then referenced in the request body schema and response body schema as follows:

```js
/**
 * GET /users/{userId}
 * @summary Returns a user by ID.
 * @pathParam {integer} userId
 * @response 200 - OK
 * @responseContent {User} 200.application/json
 */

/**
 * POST /users
 * @summary Creates a new user.
 * @bodyContent {User} application/json
 * @bodyRequired
 * @response 201 - Created
 */
```

### Authentication
The `securitySchemes` and `security` keywords are used to describe the authentication methods used in your API.
```yaml
components:
  securitySchemes:
    BasicAuth:
      type: http
      scheme: basic
```

```js
/**
 * GET /users
 * @security BasicAuth
 */
```

Supported authentication methods are:
- HTTP authentication: Basic, Bearer, and so on.
- API key as a header or query parameter or in cookies
- OAuth 2
- OpenID Connect Discovery

For more information, see [Authentication](/docs/authentication.md).
