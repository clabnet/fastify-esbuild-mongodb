import fp from 'fastify-plugin'
import mongo from '@fastify/mongodb'
import { FastifyInstance, FastifyServerOptions } from 'fastify'

import config from '../common/config'

/**
 * This plugins adds MongoDB connection plugin
 *
 * @see https://github.com/fastify/fastify-mongodb
 */
export default fp(
  async (fastify: FastifyInstance, opts: FastifyServerOptions) => {
    await fastify.register(mongo, {
      // force to close the mongodb connection when app stopped
      forceClose: true,
      url: config.mongo.connection
    })
  }
)
