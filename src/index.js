const cluster = require('cluster')
const numCPUs = require('os').cpus().length

const logger = require('./services/logger')
const config = require('./services/config')

if (cluster.isMaster) {
  // Exit master if something very bad happens to him so that workers also
  // exits and we restart everything.
  process.on('uncaughtException', (err) => {
    logger.error(err)
    process.nextTick(() => process.exit(1))
  })

  // Fork workers.
  for (let i = 0; i < (config.get('server:webWorkers') || numCPUs); i++) {
    cluster.fork()
  }

  // When a worker unexpectedly die, restart it.
  const respawnWorker = (/* worker, code, signal */) => {
    logger.error('Worker died, restarting it.')
    cluster.fork()
  }
  cluster.on('exit', respawnWorker)

  process.once('SIGTERM', () => {
    logger.info('SIGTERM recevied, exiting...')

    // Stop respawning workers.
    cluster.removeListener('exit', respawnWorker)

    // Kill workers processes.
    Promise.all(cluster.workers.map(worker => new Promise((resolve, reject) => {
      try {
        worker.once('exit', resolve)
        worker.process.kill()
      } catch (err) {
        reject(err)
      }
    })))
    .then(() => process.exit())
    .catch(() => process.exit(1))
  })
} else {
  const app = require('./app')
  const serverPort = process.env.PORT || config.get('server:port')
  const server = app.listen(serverPort, () => logger.info('Web worker server started on port %d.', serverPort))

  process.on('uncaughtException', (err) => {
    logger.error(err)
    process.nextTick(() => process.exit(1))
  })

  // Server graceful shutown.
  process.once('SIGTERM', () => {
    logger.info('Worker exited')
    // Waiting for all connections to be properly closed.
    server.close(() => process.exit())

    // Exit anyways after a timeout.
    setTimeout(() => {
      logger.error('Forcing shutdown, all connections haven’t been properly closed.')
      process.exit(1)
    }, config.get('server:timeout'))
  })
}
