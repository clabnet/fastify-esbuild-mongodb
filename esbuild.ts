import glob from 'tiny-glob'
import { build } from 'esbuild'
import esbuildPluginPino from 'esbuild-plugin-pino'

(async function () {

  const env = process.argv[2]

  // Get all ts files
  const entryPoints = await glob('src/**/*.ts')

  build({
    entryPoints,
    logLevel: 'info',
    outdir: env === 'dev' ? 'dist' : 'build',
    bundle: env === 'dev' ? false : true,
    minify: true,
    platform: 'node',
    format: 'cjs',
    sourcemap: true,
    plugins: [esbuildPluginPino({ transports: ['pino-pretty'] })],
    external: ["esnext", "@fastify/swagger", "@fastify/swagger-ui"]
  })
})()
