# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations - Version 2

### Goal
Add CRUD operations for authors so books can reference them through `authorId`. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, unique custom id such as `a1`
- `name`: string, required, the author's full name

Use custom ids for route parameters and book references. MongoDB `_id` values are internal and should not appear in author responses. Names must be trimmed, nonempty strings with a maximum of 100 characters. Author ids cannot be changed.

### Relationship to Books
Before deleting an author, check whether any book has a matching `authorId`. If so, return `409` and keep the author and books unchanged. The books must be deleted or assigned to another author first.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects, or `[]` if there are none

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by their custom id.

Success:
- Status code: `200`
- Response body: the matching author object, such as `{"id":"a1","name":"George Orwell"}`

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a1",
      "name": "George Orwell"
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing, empty, or invalid
- `409` if the `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author's name.

Request body:

    {
      "name": "Eric Arthur Blair"
    }

Success:
- Status code: `200`
- Response body: the updated author object, such as `{"id":"a1","name":"Eric Arthur Blair"}`

Errors:
- `400` if the name is missing, empty, or invalid
- `400` if the body includes `id`, `_id`, or other unsupported fields
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an author who has no books.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if any book still references the author
- `500` if an unexpected server or database error occurs

### Validation and Error Responses
Create requests accept only `id` and `name`; update requests accept only `name`. Invalid fields or malformed JSON return `400`. Ids must be nonempty strings. Only validated fields should be passed to MongoDB.

All errors return a JSON message. Use `{"message":"Invalid author data"}` for invalid input, `{"message":"Author not found"}` for missing authors, `{"message":"Author id already exists"}` for duplicate ids, and `{"message":"Cannot delete author with existing books"}` for blocked deletions. Unexpected errors return `{"message":"Internal server error"}` without database details.

### Swagger Documentation
Swagger must document every author route, including request bodies and success and error responses.

### Deployment Expectations
After implementation, the author routes must work locally and on Render. The deployed Swagger page at `/api-docs` must allow someone to test every author route.

