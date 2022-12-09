// https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial

import { type RouteHandler } from 'fastify'
import { Params, Querystring, Board, Reply, BoardNotFound } from './schema'
import { collections } from '../../common/collections.js'
import { v4 as uuidv4 } from 'uuid'

/**
 * Get all boards
 */
export const getBoards: RouteHandler<{
  Querystring: Querystring
  Reply: Reply | BoardNotFound
}> = async function (req, reply) {
  const { deleted } = req.query

  const collection = this.mongo.db?.collection(collections.boards)

  const boards = (await collection.find<Board[]>({ deleted: deleted }).toArray())

  boards.length > 0
    ? reply.code(200).send({ boards: boards })
    : reply.code(404).send({ error: 'Board not found' })
}

/**
 * Get board by ID
 */
export const getBoardById: RouteHandler<{
  Params: Params
  Reply: Reply | BoardNotFound
}> = async function (req, reply) {
  const { id } = req.params

  const collection = this.mongo.db?.collection(collections.boards)

  const board = await collection?.findOne<Board>({
    id: id
  })

  board
    ? reply.code(200).send({ boards: [board] })
    : reply.code(404).send({ error: 'Board not found' })
}

/**
 * POST Add a new board
 */
export const createBoard: RouteHandler<{
  Body: Board
  Reply: Reply
}> = async function (req, reply) {
  const newBoard = {
    id: uuidv4(),
    ...req.body
  }

  const collection = this.mongo.db?.collection(collections.boards)

  const result = await collection?.insertOne(newBoard)

  result
    ? reply.code(201).header('Location', `/boards/${newBoard.id}`)
    : reply.internalServerError
}

/**
 * PUT Update a board
 */
export const updateBoard: RouteHandler<{
  Params: Params
  Body: Board
  Reply: BoardNotFound
}> = async function (req, reply) {
  const { id } = req.params

  const collection = this.mongo.db?.collection(collections.boards)

  const filter = {
    id: id
  }

  const updateDoc = {
    $set: { ...req.body }
  }

  const options = {
    returnNewDocument: true
  }

  const board = collection?.findOneAndUpdate(filter, updateDoc, options)

  board
    ? reply.code(204).send()
    : reply.code(304).send({ error: `Board ${filter.id} not updated` })
}

/**
 * DELETE Delete a board
 * @param req 
 * @param reply 
 */
export const deleteBoard: RouteHandler<{
  Params: Params
  Reply: Reply | BoardNotFound
}> = async function (req, reply) {
  const { id } = req.params
  const collection = this.mongo.db?.collection(collections.boards)
  const result = await collection?.deleteOne({
    id: id
  })

  if (result && result.deletedCount) {
    reply.code(202).send({ error: `Successfully removed board with id ${id}` });
  } else if (!result) {
    reply.code(400).send({ error: `Failed to remove board with id ${id}` });
  } else if (!result.deletedCount) {
    reply.code(404).send({ error: `Board with id ${id} does not exist` });
  }

}
