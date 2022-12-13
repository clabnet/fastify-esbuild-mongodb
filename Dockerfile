FROM node:18.10.0-bullseye-slim AS builder

RUN mkdir -p /app

WORKDIR /app

COPY . .

# Install the dependencies in the container
RUN npx pnpm install --frozen-lockfile

# build application
RUN npx tsx esbuild.ts

FROM node:18.10.0-bullseye-slim as app

ENV NODE_ENV=production

RUN mkdir -p /app

WORKDIR /app

COPY --chown=node:node --from=builder /app/build/index.js /app

EXPOSE 5000

ENTRYPOINT ["node", "./app/build/index.js"]

#CMD [ "node", "./build/index.js" ]
