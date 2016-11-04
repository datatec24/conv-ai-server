const express = require('express')
const expressWinston = require('express-winston')

const router = require('./router')
const logger = require('../services/logger')
const errorHandler = require('./middlewares/error-handler')

/**
 * Expose application.
 */

const app = module.exports = express()

app.use(expressWinston.logger({ winstonInstance: logger }))

// Mount `routes` folder.
app.use(router)

app.use(expressWinston.errorLogger({
  winstonInstance: logger,
  msg: '{{err.message}}'
}))

app.use(errorHandler())
