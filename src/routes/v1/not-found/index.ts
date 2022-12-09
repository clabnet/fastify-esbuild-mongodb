import type { FastifyPluginAsync } from 'fastify'

const notFound: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/notfound', async function (req, reply) {
    reply.notFound()
  })

  fastify.get('/async', async (req, reply) => {
    throw fastify.httpErrors.notFound()
  })

  fastify.get('/async-return', async (req, reply) => {
    return reply.notFound()
  })
}

export default notFound
