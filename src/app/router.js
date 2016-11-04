const path = require('path')
const express = require('express')
const requireDirectory = require('require-directory')

const ROUTES_DIRECTORY = path.join(__dirname, './routes')
const router = module.exports = express.Router()

requireDirectory(module, ROUTES_DIRECTORY, {
  exclude: /.test.js$/,
  visit: (route, filepath) => {
    const uri = path.relative(ROUTES_DIRECTORY, filepath).replace(/(index)?.js$/, '')
    const subRouter = express.Router()

    route(subRouter)

    router.use(`/${uri}`, subRouter)
  }
})
