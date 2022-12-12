import fp from 'fastify-plugin'
import swagger, { FastifyDynamicSwaggerOptions } from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

export default fp<FastifyDynamicSwaggerOptions>(async (fastify) => {
  await fastify.register(swagger, {
    mode: 'dynamic',
    openapi: {
      info: {
        title: 'fastify-esbuild-mongodb',
        description:
          'A typescript boilerplate for Fastify, ESBuild, Swagger, Mongodb native driver',
        version: '1.0.0'
      },
      servers: [{ url: 'http://localhost:5000' }]
      //externalDocs: Object,
      //components: Object,
      //security: [ Object ],
      //tags: [ Object ]
    }
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/swagger',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (_request, _reply, next) {
        next()
      },
      preHandler: function (_request, _reply, next) {
        next()
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  })
})
