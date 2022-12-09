// https://davipon.hashnode.dev/better-backend-dx-json-schema-typescript-swagger-vol-1#heading-stop-typing-twice

import { FastifySchema } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

// Entity schema
export const boardSchema = {
  $id: 'board',
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    published: { type: 'boolean' },
    content: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    deleted: { type: 'boolean' }
  },
  required: ['title', 'published', 'content', 'tags', 'deleted']
} as const

// Body schema
export type Board = FromSchema<typeof boardSchema>

// Not found schema
export const boardNotFoundSchema = {
  $id: 'boardNotFound',
  type: 'object',
  required: ['error'],
  properties: {
    error: { type: 'string' }
  },
  additionalProperties: false
} as const

// Board not found schema
export type BoardNotFound = FromSchema<typeof boardNotFoundSchema>

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
    deleted: { type: 'boolean' }
  },
  additionalProperties: false
} as const

export type Querystring = FromSchema<typeof querystringSchema>

// Response schema
const replySchema = {
  type: 'object',
  properties: {
    // Return array of boards object
    boards: {
      type: 'array',
      items: { $ref: 'board#' }
    }
  },
  additionalProperties: false
} as const

export type Reply = FromSchema<
  typeof replySchema,
  { references: [typeof boardSchema] }
>

// ---------
// Route schemas are composed of request, response schemas, and extra property
// so that @fastify/swagger can automatically generate OpenAPI spec & Swagger UI
// ---------

/* Get all boards */
export const getBoardsSchema: FastifySchema = {
  tags: ['boards'],
  description: 'Get boards',
  querystring: querystringSchema,
  response: {
    200: {
      ...replySchema
    }
  }
}

/* Get board by ID */
export const getBoardByIdSchema: FastifySchema = {
  tags: ['boards'],
  description: 'Get a board by id',
  params: paramsSchema,
  response: {
    200: {
      ...replySchema
    },
    404: {
      description: 'The board was not found',
      $ref: 'boardNotFound#'
    }
  }
}

/* Create a board */
export const createBoardSchema: FastifySchema = {
  tags: ['boards'],
  description: 'Create a new board',
  body: boardSchema,
  response: {
    201: {
      description: 'The board was created',
      headers: {
        Location: {
          type: 'string',
          description: 'URL of the new resource'
        }
      },
      // Return newly created resource as the body of the response
      ...boardSchema
    }
  }
}

/* Put */
export const updateBoardSchema: FastifySchema = {
  tags: ['boards'],
  description: 'Update a board',
  params: paramsSchema,
  body: boardSchema,
  response: {
    204: {
      description: 'The board was updated',
      type: 'null'
    },
    404: {
      description: 'The board was not found',
      $ref: 'boardNotFound#'
    }
  }
}

/* Delete */
export const deleteBoardSchema: FastifySchema = {
  tags: ['boards'],
  description: 'Delete a board',
  params: paramsSchema,
  response: {
    204: {
      description: 'The board was deleted',
      type: 'null'
    },
    404: {
      description: 'The board was not found',
      $ref: 'boardNotFound#'
    }
  }
}
