const fs = require('fs')
const path = require('path')
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

  const workerTypes = {}
  const addWorker = workerType => {
    Object.assign(workerTypes, {
      [cluster.fork({ workerType }).id]: workerType
    })
  }

  // Fork web workers.
  for (let i = 0; i < (config.get('server:webWorkers') || numCPUs); i++) {
    addWorker('web')
  }

  // Fork jobs worker
  fs.readdirSync(path.join(__dirname, 'jobs')).map(addWorker)

  // When a worker unexpectedly die, restart it.
  const respawnWorker = ({ id }/*, code, signal */) => {
    logger.error('Worker died, restarting it.')
    addWorker(workerTypes[id])
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
  process.on('uncaughtException', (err) => {
    logger.error(err)
    process.nextTick(() => process.exit(1))
  })

  if (process.env.workerType === 'web') {
    require('./server')
  } else {
    require(`./jobs/${process.env.workerType}`)
  }
}
