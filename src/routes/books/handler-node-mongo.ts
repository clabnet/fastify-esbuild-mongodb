// https://ship.paralect.com/docs/api/testing#example

import { type RouteHandler } from 'fastify'
import { Params, Querystring, Book, Reply, BookNotFound } from './schema'
import { collections } from '../../common/collections.js'
import { v4 as uuidv4 } from 'uuid'

import { Database } from '@paralect/node-mongo'

import config from '../../common/config'

const database = new Database(config.mongo.connection)
const booksService = database.createService<Book>('books', {})

/**
 * Get all books
 */
export const getBooks: RouteHandler<{
  Querystring: Querystring
  Reply: Reply | BookNotFound
}> = async function (req, reply) {
  const { deleted } = req.query

  await database.connect()

  const { results } = await booksService.find({ deleted: deleted })

  // database.close()

  results.length > 0
    ? reply.code(200).send({ books: results })
    : reply.code(404).send({ error: 'Book not found' })
}

/**
 * Get all books paginated
 */
export const getBooksPaged: RouteHandler<{
  Querystring: Querystring
  Reply: Reply | BookNotFound
}> = async function (req, reply) {
  const { deleted, page, perPage } = req.query

  await database.connect()

  const { results } = await booksService.find(
    { deleted: deleted },
    { page: page, perPage: perPage }
  )

  results.length > 0
    ? reply.code(200).send({ books: results })
    : reply.code(404).send({ error: 'Book not found' })
}

/**
 * Get book by ID
 */
export const getBookById: RouteHandler<{
  Params: Params
  Reply: Reply | BookNotFound
}> = async function (req, reply) {
  const { id } = req.params

  const collection = this.mongo.db?.collection(collections.books)

  const book = await collection?.findOne<Book>({
    id: id
  })

  book
    ? reply.code(200).send({ books: [book] })
    : reply.code(404).send({ error: 'Book not found' })
}

/**
 * POST Add a new book
 */
export const createBook: RouteHandler<{
  Body: Book
  Reply: Reply
}> = async function (req, reply) {
  const newBook = {
    id: uuidv4(),
    ...req.body
  }

  const collection = this.mongo.db?.collection(collections.books)

  const result = collection?.insertOne(newBook)

  result
    ? reply.code(201).header('Location', `/books/${newBook.id}`)
    : reply.internalServerError
}

/**
 * PUT Update a book
 */
export const updateBook: RouteHandler<{
  Params: Params
  Body: Book
  Reply: BookNotFound
}> = async function (req, reply) {
  const { id } = req.params

  const collection = this.mongo.db?.collection(collections.books)

  const filter = {
    id: id
  }

  const updateDoc = {
    $set: { ...req.body }
  }

  const book = collection?.findOneAndUpdate(filter, updateDoc, {
    returnDocument: 'after'
  })

  book
    ? reply.code(204).send()
    : reply.code(304).send({ error: `Book ${filter.id} not updated` })
}

/**
 * DELETE Delete a book
 * @param req
 * @param reply
 */
export const deleteBook: RouteHandler<{
  Params: Params
  Reply: Reply | BookNotFound
}> = async function (req, reply) {
  const { id } = req.params
  const collection = this.mongo.db?.collection(collections.books)
  const result = await collection?.deleteOne({
    id: id
  })

  if (result && result.deletedCount) {
    reply.code(202).send({ error: `Successfully removed book with id ${id}` })
  } else if (!result) {
    reply.code(400).send({ error: `Failed to remove book with id ${id}` })
  } else if (!result.deletedCount) {
    reply.code(404).send({ error: `Book with id ${id} does not exist` })
  }
}
