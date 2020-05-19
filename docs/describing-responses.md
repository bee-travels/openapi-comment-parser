## Describing Responses
An API specification needs to specify the `responses` for all API operations.
Each operation must have at least one response defined, usually a successful response.
A response is defined by its HTTP status code and the data returned in the response body and/or headers.
Here is a minimal example:

```js
/**
 * GET /ping
 * @response 200 - OK
 * @responseContent {string} 200.text/plain
 */
```

### Response media types
An API can respond with various media types.
JSON is the most common format for data exchange, but not the only one possible.
To specify the response media types, use `@responseContent`.

```js
/**
 * GET /users
 * @summary Get all users
 * @response 200 - A list of users
 * @responseContent {ArrayOfUsers} 200.application/json
 * @responseContent {ArrayOfUsers} 200.application/json
 * @responseContent {string} 200.text/plain
 */

// This operation returns image
/**
 * GET /logo
 * @summary Get the logo image
 * @response 200 - Logo image in PNG format
 * @responseContent {binary} 200.image/png
 */
```

### HTTP status codes
Each response definition starts with a status code, such as 200 or 404.
An operation typically returns one successful status code and one or more error statuses.
To define a range of response codes, you may use the following range definitions: 1XX, 2XX, 3XX, 4XX, and 5XX.
If a response range is defined using an explicit code,
the explicit code definition takes precedence over the range definition for that code.
Each response status requires a description.
For example, you can describe the conditions for error responses.
Markdown ([CommonMark](http://commonmark.org/help/)) can be used for rich text representation.

```js
/**
 * @response 200 - OK
 * @response 400 - Bad request. User ID must be an integer and larger than 0.
 * @response 401 - Authorization information is missing or invalid.
 * @response 404 - A user with the specified ID was not found.
 * @response 5XX - Unexpected error.
 */
```

Note that an API specification does not necessarily need to cover all possible HTTP response codes, since they may not be known in advance.
However, it is expected to cover successful responses and any known errors.
By "known errors" we mean, for example, a 404 Not Found response for an operation that returns a resource by ID,
or a 400 Bad Request response in case of invalid operation parameters.

### Response body
A response body can define:
- an `object` or an `array` — typically used with JSON and XML APIs
- a primitive data type such as a `number` or `string` – used for plain text responses
- a file – (see below)

Objects can be defined in `components`:

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
          description: The user ID.
        username:
          type: string
          description: The user name.
```

and be used with:

```js
/**
 * @response 200 - A User object
 * @responseContent {User} 200.application/json
 */
```

### Response that returns a file
An API operation can return a file, such as an image or PDF.
If the response returns the file alone,
you would typically use the `binary` type and specify the appropriate media type for the response content:

```js
/**
 * GET /report
 * @summary Returns the report in the PDF format
 * @response 200 - A PDF file
 * @responseContent {binary} 200.application/pdf
 */
```

Files can also be embedded into, say, JSON or XML as a base64-encoded string.
In this case, you would use something like:

```js
/**
 * GET /users/me
 * @summary Returns user information
 * @response 200 - A JSON object containing user name and avatar
 * @responseContent {User} 200.application/json
 */
```

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        username:
          type: string
        avatar:          # <-- image embedded into JSON
          type: string
          format: byte
          description: Base64-encoded contents of the avatar image
```

### Empty response body
Some responses, such as 204 No Content, have no body.
To indicate the response body is empty, do not specify `@responseContent`:

```js
/**
 * @response 204 - The resource was deleted successfully.
 */
```

### Response headers
Responses from an API can include custom headers to provide additional information on the result of an API call.
For example, a rate-limited API may provide the rate limit status via response headers as follows:

```
HTTP 1/1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 2016-10-12T11:00:00Z

{ ... }
```

You can define custom `headers` for each response as follows:

```js
/**
 * GET /ping
 * @summary Checks if the server is alive.
 * @response 200 - OK
 * @responseHeader {integer} 200.X-RateLimit-Limit - Request limit per hour.
 * @responseHeader {integer} 200.X-RateLimit-Remaining - The number of requests left for the time window.
 * @responseHeader {date-time} 200.X-RateLimit-Reset - The UTC date/time at which the current rate limit window resets.
 */
```

Note that, currently,
OpenAPI Specification does not permit to define common response headers for different response codes or different API operations.
You need to define the headers for each response individually.

### Response examples
Examples can be defined in `components`:

```yaml
components:
  examples:
    Jessica:
      value:
        id: 10
        name: Jessica Smith
    Ron:
      value:
        id: 11
        name: Ron Stewart
```

And be used as:

```js
/**
 * POST /users
 * @summary Adds a new user
 * @response 200 - OK
 * @responseContent {User} 200.application/json
 * @responseExample {Jessica} 200.application/json.Jessica
 * @responseExample {Ron} 200.application/json.Ron
 */
```

### Default response
Sometimes, an operation can return multiple errors with different HTTP status codes,
but all of them have the same response structure:

```js
/**
 * @response 200 - Success
 * @responseContent {User} 200.application/json
 * 
 * @response 400 - Bad request
 * @responseContent {Error} 400.application/json
 * 
 * @response 404 - Not found
 * @responseContent {Error} 404.application/json
 */
```

You can use the default response to describe these errors collectively, not individually.
"Default" means this response is used for all HTTP codes that are not covered individually for this operation.

```js
/**
 * @response 200 - Success
 * @responseContent {User} 200.application/json
 * 
 * @response default - Unexpected error
 * @responseContent {Error} default.application/json
 */
```

### Reusing responses
Responses can be defined in `components` to be reused elsewhere.
The following response definition:

```yaml
components:
  responses:
    NotFound:
      description: The specified resource was not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
  schemas:
    # Schema for error response body
    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
      required:
        - code
        - message
```

Can be reused as:

```js
/**
 * GET /users
 * @summary Gets a list of users.
 * 
 * @response 200 - OK
 * @responseContent {ArrayOfUsers} 200.application/json
 * 
 * @responseComponent {Unauthorized} 401
 */

/**
 * GET /users/{id}
 * @summary Gets a user by ID.
 * 
 * @response 200 - OK
 * @responseContent {User} 200.application/json
 * 
 * @responseComponent {Unauthorized} 401
 * 
 * @responseComponent {NotFound} 404
 */
```
