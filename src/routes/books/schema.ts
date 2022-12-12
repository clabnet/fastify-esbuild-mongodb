// https://davipon.hashnode.dev/better-backend-dx-json-schema-typescript-swagger-vol-1#heading-stop-typing-twice

import { FastifySchema } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

// Entity schema
export const bookSchema = {
  $id: 'book',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    id: { type: 'string' },
    title: { type: 'string' },
    published: { type: 'boolean' },
    content: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    deleted: { type: 'boolean' }
  },
  required: ['id', 'title']
} as const

// Body schema
export type Book = FromSchema<typeof bookSchema>

// Not found schema
export const bookNotFoundSchema = {
  $id: 'bookNotFound',
  type: 'object',
  required: ['error'],
  properties: {
    error: { type: 'string' }
  },
  additionalProperties: false
} as const

// Book not found schema
export type BookNotFound = FromSchema<typeof bookNotFoundSchema>

// Params schema
const paramsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' }
  },
  additionalProperties: false
} as const

export type Params = FromSchema<typeof paramsSchema>

// Query schema
const querystringSchema = {
  type: 'object',
  properties: {
    deleted: {
      type: 'boolean',
      description: 'True/False to return deleted records',
      default: false
    },
    page: { type: 'number', description: 'Requested page', default: 1 },
    perPage: {
      type: 'number',
      description: 'Rows for pages requested',
      default: 2
    }
  },
  additionalProperties: false
} as const

export type Querystring = FromSchema<typeof querystringSchema>

// Response schema
const replySchema = {
  type: 'object',
  properties: {
    // Return array of books object
    books: {
      type: 'array',
      items: { $ref: 'book#' }
    }
  },
  additionalProperties: false
} as const

export type Reply = FromSchema<
  typeof replySchema,
  { references: [typeof bookSchema] }
>

// ---------
// Route schemas are composed of request, response schemas, and extra property
// so that @fastify/swagger can automatically generate OpenAPI spec & Swagger UI
// ---------

/* Get all books */
export const getBooksSchema: FastifySchema = {
  tags: ['books'],
  description: 'Get books',
  querystring: querystringSchema,
  response: {
    200: {
      ...replySchema
    }
  }
}

/* Get book by ID */
export const getBookByIdSchema: FastifySchema = {
  tags: ['books'],
  description: 'Get a book by id',
  params: paramsSchema,
  response: {
    200: {
      ...replySchema
    },
    404: {
      description: 'The book was not found',
      $ref: 'bookNotFound#'
    }
  }
}

/* Create a book */
export const createBookSchema: FastifySchema = {
  tags: ['books'],
  description: 'Create a new book',
  body: bookSchema,
  response: {
    201: {
      description: 'The book was created',
      headers: {
        Location: {
          type: 'string',
          description: 'URL of the new resource'
        }
      },
      // Return newly created resource as the body of the response
      ...bookSchema
    }
  }
}

/* Put */
export const updateBookSchema: FastifySchema = {
  tags: ['books'],
  description: 'Update a book',
  params: paramsSchema,
  body: bookSchema,
  response: {
    204: {
      description: 'The book was updated',
      type: 'null'
    },
    404: {
      description: 'The book was not found',
      $ref: 'bookNotFound#'
    }
  }
}

/* Delete */
export const deleteBookSchema: FastifySchema = {
  tags: ['books'],
  description: 'Delete a book',
  params: paramsSchema,
  response: {
    204: {
      description: 'The book was deleted',
      type: 'null'
    },
    404: {
      description: 'The book was not found',
      $ref: 'bookNotFound#'
    }
  }
}
