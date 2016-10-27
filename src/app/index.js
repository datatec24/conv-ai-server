const path = require('path')
const express = require('express')
const expressWinston = require('express-winston')
const enrouten = require('express-enrouten')
const logger = require('../services/logger')
const errorHandler = require('./middlewares/error-handler')

/**
 * Expose application.
 */

const app = module.exports = express()

app.use(expressWinston.logger({ winstonInstance: logger }))

// Mount `routes` folder.
app.use(enrouten({
  directory: path.resolve(__dirname, 'routes')
}))

app.use(expressWinston.errorLogger({
  winstonInstance: logger,
  msg: '{{err.message}}'
}))

app.use(errorHandler())
