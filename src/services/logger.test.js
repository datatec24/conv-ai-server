jest.mock('winston', () => ({
  transports: {
    Console: jest.fn(),
    Memory: jest.fn()
  },
  Logger: jest.fn()
}))

jest.mock('winston-elasticsearch', () => jest.fn())

const config = require('./config')

beforeEach(() => {
  config.overrides({
    logger: {
      transports: {
        console: {
          foo: 'bar'
        },
        memory: false
      }
    }
  })
})

it('should setup logger with transports accoring to config', () => {
  require('./logger')
  const winston = require('winston')

  expect(winston.Logger).toHaveBeenCalled()

  expect(winston.transports.Console).toHaveBeenCalledWith({ foo: 'bar' })
  expect(winston.transports.Memory).not.toHaveBeenCalled()
  expect(require('winston-elasticsearch')).not.toHaveBeenCalled()
})
