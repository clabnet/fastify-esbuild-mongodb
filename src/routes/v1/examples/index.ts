import type { FastifyPluginAsync } from 'fastify'

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Note: using an arrow function will break the binding of this to the FastifyInstance.
  fastify.get('/', async function (request, reply) {
    return this.someSupport()
  })
}

export default example
