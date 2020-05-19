## Describing Request Body
Request bodies are typically used with "create" and "update" operations (POST, PUT, PATCH).
For example, when creating a resource using POST or PUT,
the request body usually contains the representation of the resource to be created.

It's important to note that unlike parameters, **request bodies are optional by default**.
To mark the body as required, use `@bodyRequired`.

```js
/**
 * POST /pets
 * @summary Add a new pet
 * @bodyDescription Optional description in *Markdown*
 * @bodyContent {Pet} application/json
 * @bodyContent {Pet} application/xml
 * @bodyContent {PetForm} application/x-www-form-urlencoded
 * @bodyContent {string} text/plain
 * @bodyRequired
 * @response 201 - Created
 */
```

`@bodyContent` allows wildcard media types.
For example, `image/*` represents all image types; `*/*` represents all types and is functionally equivalent to `application/octet-stream`.
Specific media types have preference over wildcard media types when interpreting the spec, for example, `image/png` > `image/*` > `*/*`.

> **Note:** `*/*` must be escaped in comments with `*\/*`.

```js
// Can be image/png, image/svg, image/gif, etc.
/**
 * PUT /avatar
 * @summary Upload an avatar
 * @bodyContent {binary} image/*
 * @bodyRequired
 * @response 201 - Created
 */
```

```js
// Can be anything.
/**
 * PUT /file
 * @summary Upload any file
 * @bodyContent {binary} *\/*
 * @bodyRequired
 * @response 201 - Created
 */
```

### Reusable request bodies
Request bodies can be defined in `components` to be reused elsewhere.
The following request body definition:

```yaml
components:
  requestBodies:
    PetBody:
      description: A JSON object containing pet information
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Pet'
```

Can be reused as:

```js
/**
 * POST /pets
 * @summary Add a new pet
 * @bodyComponent {PetBody}
 */

/**
 * PUT /pets/{petId}
 * @summary Update a pet
 * @bodyComponent {PetBody}
 */
```

### Form data
The term "form data" is used for the media types `application/x-www-form-urlencoded` and `multipart/form-data`,
which are commonly used to submit HTML forms.
- `application/x-www-form-urlencoded` is used to send simple ASCII text data as key=value pairs.
The payload format is similar to query parameters.
- `multipart/form-data` allows submitting binary data as well as multiple media types in a single message (for example, image and JSON).
Each form field has its own section in the payload with internal HTTP headers.
`multipart` requests are commonly used for file uploads.

To illustrate form data, consider an HTML POST form:

```html
<form action="http://example.com/survey" method="post">
  <input type="text"   name="name" />
  <input type="number" name="fav_number" />
  <input type="submit"/>
</form>
```

This form POSTs data to the form's endpoint:

```
POST /survey HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

name=Amy+Smith&fav_number=42
```

Form data is defined in `components` and modeled using a `type: object` schema where the object properties represent the form fields:

```yaml
components:
  schemas:
    Survey:
      type: object
      properties:
        name:          # <!--- form field name
          type: string
        fav_number:    # <!--- form field name
          type: integer
      required:
        - name
        - fav_number
```

 It can be used with:

```js
/**
 * POST /survey
 * @bodyContent {Survey} application/x-www-form-urlencoded
 * @bodyRequired
 */
```