const EventEmitter = require('events')
const uuid = require('uuid')
const { wrap } = require('co')

jest.mock('os', () => ({
  cpus: () => ({
    length: 4
  })
}))

jest.mock('fs', () => {
  const fs = require.requireActual('fs')

  return Object.assign({}, fs, {
    readdirSync: jest.fn(path => {
      if (~path.indexOf('jobs')) {
        return [
          'foo',
          'bar'
        ]
      }

      return fs.readdirSync(path)
    })
  })
})

jest.mock('./services/logger')

jest.mock('./server', () => jest.fn())

jest.mock('cluster', () => {
  const clusterMock = Object.assign(new EventEmitter(), {
    fork: jest.fn(() => {
      const id = uuid.v4()

      const workerMock = Object.assign(new EventEmitter(), {
        id,
        process: {
          kill: jest.fn(() => workerMock.emit('exit'))
        }
      })

      clusterMock.workers.push(workerMock)

      return workerMock
    }),
    workers: []
  })

  return clusterMock
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

describe('#master', () => {
  beforeEach(() => {
    require('cluster').isMaster = true
  })

  it('should handle uncaught exceptions', () => {
    require('./index')
    const logger = require('./services/logger')

    expect(process.on).toHaveBeenCalled()
    expect(process.on.mock.calls[0][0]).toBe('uncaughtException')

    const error = new Error('TEST')
    process.emit('uncaughtException', error)

    expect(logger.error).toHaveBeenCalledWith(error)

    expect(process.exit).not.toHaveBeenCalled()

    jest.runAllTicks()

    expect(process.exit).toHaveBeenCalled()
    expect(process.exit.mock.calls[0][0]).toBeTruthy()
  })

  it('should spawn workers', () => {
    require('./index')

    // 4 cpus + 2 jobs
    expect(require('cluster').fork).toHaveBeenCalledTimes(6)
  })

  it('should re-spawn workers on exit', () => {
    require('./index')
    const cluster = require('cluster')
    const logger = require('./services/logger')

    cluster.fork.mockClear()
    cluster.emit('exit', cluster.workers[0])

    expect(logger.error).toHaveBeenCalledWith('Worker died, restarting it.')
    expect(cluster.fork).toHaveBeenCalledTimes(1)
  })

  describe('on SIGTERM', () => {
    it('should exit gracefully', wrap(function* () {
      require('./index')
      const cluster = require('cluster')
      const logger = require('./services/logger')

      cluster.fork.mockClear()

      process.emit('SIGTERM')
      expect(logger.info).toHaveBeenCalledWith('SIGTERM recevied, exiting...')

      // `jest.runAllTicks` won't wait for promise chains
      yield new Promise(resolve => process.nextTick(resolve))

      expect(cluster.workers.length).toBeGreaterThan(0)
      cluster.workers.forEach(worker => {
        expect(worker.process.kill).toHaveBeenCalled()
      })

      expect(cluster.fork).not.toHaveBeenCalled()
      expect(process.exit).toHaveBeenCalled()
      expect(process.exit.mock.calls[0][0]).toBeFalsy()
    }))

    it('should exit with error code if worker fail to stop', wrap(function* () {
      require('./index')
      const cluster = require('cluster')

      cluster.workers[0].process.kill.mockImplementation(() => {
        throw new Error('TEST')
      })
      process.emit('SIGTERM')

      // `jest.runAllTicks` won't wait for promise chains
      yield new Promise(resolve => process.nextTick(resolve))

      expect(process.exit).toHaveBeenCalled()
      expect(process.exit.mock.calls[0][0]).toBeTruthy()
    }))
  })
})

describe('#slave', () => {
  beforeEach(() => {
    require('cluster').isMaster = false
    process.env.workerType = 'web'
  })

  afterEach(() => {
    delete process.env.workerType
  })

  it('should handle uncaugth exceptions', () => {
    require('./index')
    const logger = require('./services/logger')

    expect(process.on).toHaveBeenCalled()
    expect(process.on.mock.calls[0][0]).toBe('uncaughtException')

    const error = new Error('TEST')
    process.emit('uncaughtException', error)

    expect(logger.error).toHaveBeenCalledWith(error)

    expect(process.exit).not.toHaveBeenCalled()

    jest.runAllTicks()

    expect(process.exit).toHaveBeenCalled()
    expect(process.exit.mock.calls[0][0]).toBeTruthy()
  })
})
