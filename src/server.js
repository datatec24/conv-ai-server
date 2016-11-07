const app = require('./app')
const config = require('./services/config')
const logger = require('./services/logger')

const serverPort = process.env.PORT || config.get('server:port')
const server = app.listen(serverPort, () => logger.info('Web worker server started on port %d.', serverPort))

// Server graceful shutown.
process.once('SIGTERM', () => {
  logger.info('Worker exited')
  // Waiting for all connections to be properly closed.
  server.close(() => process.exit())

  // Exit anyway after a timeout.
  setTimeout(() => {
    logger.error('Forcing shutdown, all connections haven’t been properly closed.')
    process.exit(1)
  }, config.get('server:timeout'))
})
