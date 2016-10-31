const path = require('path')

jest.mock('express', () => jest.fn(() => ({
  use: jest.fn()
})))

jest.mock('express-winston', () => ({
  logger: jest.fn(),
  errorLogger: jest.fn()
}))

jest.mock('express-enrouten', () => jest.fn())

jest.mock('../services/logger')

jest.mock('./middlewares/error-handler', () => jest.fn())

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

it('should setup router', () => {
  require('./index')
  const enrouten = require('express-enrouten')

  expect(enrouten).toHaveBeenCalledWith({
    directory: path.resolve(__dirname, 'routes')
  })
})

it('should setup error logger', () => {
  require('./index')
  const expressWinston = require('express-winston')

  expect(expressWinston.errorLogger).toHaveBeenCalled()
})

it('should setup errro handler', () => {
  require('./index')
  const errorHandler = require('./middlewares/error-handler')

  expect(errorHandler).toHaveBeenCalled()
})
