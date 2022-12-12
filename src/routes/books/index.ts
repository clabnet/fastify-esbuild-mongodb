import type { FastifyInstance } from 'fastify'

import {
  bookSchema,
  bookNotFoundSchema,
  getBooksSchema,
  getBookByIdSchema,
  createBookSchema,
  updateBookSchema,
  deleteBookSchema
} from './schema'

import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBooksPaged
} from './handler-node-mongo'

// https://www.fastify.io/docs/latest/Reference/Routes/#shorthand-declaration
export default async (fastify: FastifyInstance) => {
  // Add schema so they can be shared and referred
  fastify.addSchema(bookSchema)
  fastify.addSchema(bookNotFoundSchema)
  // routes definitions
  // fastify.get('/', { schema: getBooksSchema }, getBooks)
  fastify.get('/', { schema: getBooksSchema }, getBooksPaged)
  fastify.get('/:id', { schema: getBookByIdSchema }, getBookById)
  fastify.post('/', { schema: createBookSchema }, createBook)
  fastify.put('/:id', { schema: updateBookSchema }, updateBook)
  fastify.delete('/:id', { schema: deleteBookSchema }, deleteBook)
}
