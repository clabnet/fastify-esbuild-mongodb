import type { FastifyInstance } from 'fastify'

import {
  boardSchema,
  boardNotFoundSchema,
  getBoardsSchema,
  getBoardByIdSchema,
  createBoardSchema,
  updateBoardSchema,
  deleteBoardSchema
} from './schema'

import {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard
} from './handler'

// https://www.fastify.io/docs/latest/Reference/Routes/#shorthand-declaration
export default async (fastify: FastifyInstance) => {
  // Add schema so they can be shared and referred
  fastify.addSchema(boardSchema)
  fastify.addSchema(boardNotFoundSchema)
  // routes definitions
  fastify.get('/', { schema: getBoardsSchema }, getBoards)
  fastify.get('/:id', { schema: getBoardByIdSchema }, getBoardById)
  fastify.post('/', { schema: createBoardSchema }, createBoard)
  fastify.put('/:id', { schema: updateBoardSchema }, updateBoard)
  fastify.delete('/:id', { schema: deleteBoardSchema }, deleteBoard)
}
