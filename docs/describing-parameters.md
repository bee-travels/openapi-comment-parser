## Describing Parameters
Parameters are defined with `@pathParam`, `@queryParam`, `@headerParam`, `@cookieParam` or `@paramComponent`.
To describe a parameter, you specify its data type, name, and description.
To denote a parameter as optional, enclose its name in square brackets `[ ]`.
Here is an example:

```js
/**
 * GET /users/{userId}
 * @summary Get a user by ID.
 * @pathParam {integer} userId - Numeric ID of the user to get.
 * @queryParam {boolean} [verbose] - Return all user information.
 */
```

### Parameter types
OpenAPI 3.0 distinguishes between the following parameter types based on the parameter location.
- [path parameters](#Parameter-parameters), such as `/users/{id}`
- [query parameters](#Query-parameters), such as `/users?role=admin`
- [header parameters](#Header-parameters), such as `X-MyHeader: Value`
- [cookie parameters](#Cookie-parameters), which are passed in the `Cookie` header, such as `Cookie: debug=0; csrftoken=BUSe35dohU3O1MZvDCU`

### Parameter parameters
Path parameters are variable parts of a URL path.
They are typically used to point to a specific resource within a collection, such as a user identified by ID.
A URL can have several path parameters, each denoted with curly braces `{ }`.

```
GET /users/{id}
GET /cars/{carId}/drivers/{driverId}
GET /report.{format}
```

Each path parameter must be substituted with an actual value when the client makes an API call.
In OpenAPI, a path parameter is defined using `@pathParam`.
The parameter name must be the same as specified in the path.
Also remember path parameters are always required.
For example, the `/users/{id}` endpoint would be described as:

```js
/**
 * GET /users/{id}
 * @summary Get a user by ID.
 * @pathParam {integer} id - The user ID
 */
```

### Query parameters
Query parameters are the most common type of parameters.
They appear at the end of the request URL after a question mark (`?`),
with different `name=value` pairs separated by ampersands (`&`).
Query parameters can be required and optional.

Use `@queryParam` to denote query parameters:

```js
/**
 * @queryParam {integer} [offset] - The number of items to skip before starting to collect the result set
 * @queryParam {integer} [limit] - The numbers of items to return
 */
```

> **Note:** To describe API keys passed as query parameters, use `securitySchemes` and `security` instead.
> See [Authentication](/authentication.md).

### Header parameters
An API call may require that custom headers be sent with an HTTP request.
OpenAPI lets you define custom request headers with `@headerParam`.
For example, suppose, a call to `GET /ping` requires the `X-Request-ID` header:

```
GET /ping HTTP/1.1
Host: example.com
X-Request-ID: 77e1c83b-7bb0-437b-bc50-a7a58e5660ac
```

You would define this operation as follows:

```js
/**
 * GET /ping
 * @summary Checks if the server is alive
 * @headerParam {string} X-Request-ID
 */
```

> **Note:** Header parameters named `Accept`, `Content-Type` and `Authorization` are not allowed.

### Cookie parameters
Operations can also pass parameters in the `Cookie` header, as `Cookie: name=value`.
Multiple cookie parameters are sent in the same header, separated by a semicolon and space.

```
GET /api/users
Host: example.com
Cookie: debug=0; csrftoken=BUSe35dohU3O1MZvDCUOJ
```

Use `@cookieParam` to define cookie parameters:

```js
/**
 * @cookieParam {integer} [debug]
 * @cookieParam {string} [csrftoken]
 */
```

> **Note:** To define cookie authentication, use `securitySchemes` and `security` instead.
> See [Authentication](/authentication.md).

### Required and optional parameters
By default, all request parameters are treated as required.
You can enclose the parameter's name in square brackets `[ ]` to mark it as optional.
Note that path parameters are always required.

### Default parameter values
Append `=value` to the variable name to specify the default value for an optional parameter.
The default value is the one that the server uses if the client does not supply the parameter value in the request.
The value type must be the same as the parameter's data type.
A typical example is paging parameters such as offset and limit:

```
GET /users
GET /users?offset=30&limit=10
```

Assuming `offset` defaults to 0 and `limit` defaults to 20, you would define these parameters as:

```js
/**
 * @queryParam {integer} [offset=0] - The number of items to skip before starting to collect the result set.
 * @queryParam {integer} [limit=20] - The number of items to return.
 */
```

### Enum parameters
You can restrict a parameter to a fixed set of values by adding the `enum` to the `schema`.
The enum values must be of the same type as the parameter data type.

```js
/**
 * @queryParam {Status} [status]
 */
```

```yaml
components:
  schemas:
    Status:
      type: string
      enum:
        - available
        - pending
        - sold
```

### Reusable Parameters
Parameters can be defined in `components` to be reused elsewhere.
The following parameter definition:

```yaml
components:
  parameters:
    ExampleParameter:
      in: query
      name: limit
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20
      required: false
      description: The number of items to return.
```

Can be used as:

```js
/**
 * @paramComponent {ExampleParameter}
 */
```