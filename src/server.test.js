const EventEmitter = require('events')

jest.mock('./services/logger')

jest.mock('./app', () => {
  const serverMock = { close: jest.fn() }

  return {
    listen: jest.fn((port, cb) => {
      cb()
      return serverMock
    }),
    server: serverMock
  }
})

beforeEach(() => {
  jest.resetModules()
  jest.useFakeTimers()
})

// Mock the `process` global
let origProcess
beforeEach(() => {
  const eventEmitter = new EventEmitter()
  origProcess = global.process

  global.process = Object.assign({}, origProcess, {
    on: jest.fn(eventEmitter.on),
    emit: jest.fn(eventEmitter.emit),
    removeListener: jest.fn(eventEmitter.removeListener),
    exit: jest.fn()
  })
})

afterEach(() => {
  global.process = origProcess
})

it('should run app', () => {
  require('./server')
  const app = require('./app')
  const config = require('./services/config')
  const logger = require('./services/logger')

  const serverPort = config.get('server:port')

  expect(app.listen).toHaveBeenCalledTimes(1)
  expect(app.listen.mock.calls[0][0]).toBe(serverPort)

  expect(logger.info).toHaveBeenCalledWith('Web worker server started on port %d.', serverPort)
})

it('should exit gracefully on SIGTERM', () => {
  require('./server')
  const app = require('./app')
  const logger = require('./services/logger')

  app.server.close.mockImplementation(cb => cb())

  process.emit('SIGTERM')

  expect(logger.error).not.toHaveBeenCalled()
  expect(process.exit).toHaveBeenCalled()
})

it('should exit after a timeout on SIGTERM', () => {
  require('./server')
  const logger = require('./services/logger')
  const config = require('./services/config')

  process.emit('SIGTERM')
  expect(logger.error).not.toHaveBeenCalled()
  expect(process.exit).not.toHaveBeenCalled()

  jest.runTimersToTime(config.get('server:timeout'))
  expect(logger.error).toHaveBeenCalledWith('Forcing shutdown, all connections haven’t been properly closed.')
  expect(process.exit).toHaveBeenCalled()
  expect(process.exit.mock.calls[0][0]).toBeTruthy()
})
