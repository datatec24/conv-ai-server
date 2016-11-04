jest.mock('express', () => {
  const express = require.requireActual('express')
  return Object.assign(jest.fn((...args) => express(...args)), express)
})

jest.mock('express-winston', () => ({
  logger: jest.fn(() => (req, res, next) => next()),
  errorLogger: jest.fn(() => (err, req, res, next) => next(err))
}))

jest.mock('../services/logger')

jest.mock('./middlewares/error-handler', () => {
  const errorHandler = require.requireActual('./middlewares/error-handler')
  return jest.fn(errorHandler)
})

it('should export an express instance', () => {
  require('./index')
  const express = require('express')

  expect(express).toHaveBeenCalled()
})

it('should setup http logger', () => {
  require('./index')
  const expressWinston = require('express-winston')

  expect(expressWinston.logger).toHaveBeenCalled()
})

it('should setup error logger', () => {
  require('./index')
  const expressWinston = require('express-winston')

  expect(expressWinston.errorLogger).toHaveBeenCalled()
})

it('should setup error handler', () => {
  require('./index')
  const errorHandler = require('./middlewares/error-handler')

  expect(errorHandler).toHaveBeenCalled()
})
