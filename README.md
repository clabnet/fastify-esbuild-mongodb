# fastify-esbuild-mongodb

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Opinionated boilerplate to build a Fastify app and Mongodb with better DX.

---

<img align="center" src="https://i.ibb.co/ZTVLZSn/fastify-esbuild-mongodb-land-image.png" alt="fastify-esbuild-mongodb-land-image" border="0">

## Introduction

This is a fork of `fastify-esbuild` , a great work from [David Peng](https://github.com/davipon)  Thank's David.

This code is born after reading the articles on [Better Backend DX: Fastify + ESBuild = ⚡️](https://davipon.hashnode.dev/better-backend-dx-fastify-esbuild)

In addition this project have these features :

- Complete MongoDB collections management with [node-mongo](https://ship.paralect.com/docs/packages/node-mongo) package to simplify Mongodb usage. 
  It is used the official Node.js driver  (**<u>Mongoose is not used</u>**)
- Full test suite using [Vitest](https://vitest.dev/)
- Configuration using dotenv environments
- CRUD complete for the `books` sample collection.



Feel to free enhancements, proposal, (errors).

----------------------

### Original article:

https://davipon.hashnode.dev/better-backend-dx-fastify-esbuild)



## Features

- Use `@fastify/autoload` for filesystem-based routes & plugins.
- Use [`esbuild-kit/tsx`](https://github.com/esbuild-kit/tsx) to reduce feedback loop during devlopment.
- Use `esbuild` to bundle production code.
- Use Conventional Commits & SemVer standards, e.g. `commitlint`, `commitizen`, `standard-version`.
- Use `eslint`, `prettier`, `lint-staged`.
- Use `husky` git hooks helper to run formatter & linter.

---

## How to start?

```zsh
# Install dependencies
pnpm i

# Activate git hooks
pnpm prepare

# Start development
pnpm dev

# Build production code
pnpm build

# Run production code
pnpm start

# New commit with interactive CLI
pnpm cz

# Auto generate changelogs and versioning
pnpm release
```

## TODO

- [ ] Add `docker` or `docker-compose` for deployment
- [x] Add `vitest` 
- [ ] Add `msw`
- [x] Add `dotenv` for different stages
- [x] Add `mongodb` examples
- [ ] Add `envoy` as a sidecar proxy
