import Fastify from 'fastify'
import { join } from 'path'
import autoLoad from '@fastify/autoload'
import { fastifyEnv } from '@fastify/env'

/**
 * The following lines initialize dotenv,
 * so that env vars from the .env file are present in process.env
 */
import * as dotenv from 'dotenv'
dotenv.config()

// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// console.log('directory-name 👉️', __dirname);

const initialize = async () => {
  const fastify = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          destination: 1,
          colorize: true,
          translateTime: 'HH:MM:ss.l',
          ignore: 'pid,hostname'
        }
      }
    }
  })

  // The schema is an object that describes the structure of the .env file.
  const schema = {
    type: 'object',
    required: ['NODE_ENV', 'MONGO_URL'],
    properties: {
      NODE_ENV: {
        type: 'string',
        default: 'development'
      },
      MONGO_URL: {
        type: 'string'
      }
    }
  }

  // Basically, this tells Fastify how to access the environment file.
  const options = {
    /**
     * The confKey specifies the name of the property
     * that will contain the configuration.
     */
    confKey: 'config',

    dotenv: true,

    /**
     * Set the schema property to the schema object
     */
    schema: schema,

    /**
     * Link it to the NodeJS process.env object
     */
    data: process.env
  }

  fastify.register(fastifyEnv, options)

  await fastify.after()
  // Now the .env variables are defined

  // Will load all plugins
  fastify.register(autoLoad, {
    dir: join(__dirname, 'plugins')
  })

  // Will load all routes under src/routes
  fastify.register(autoLoad, {
    dir: join(__dirname, 'routes')
  })

  try {
    await fastify.ready()
    // console.log(fastify.printRoutes())
    // console.log(fastify.config)

    await fastify.listen({ port: 5000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

initialize()
