module.exports = {
  server: {
    webWorkers: 1
  },
  middlewares: {
    errorHandler: {
      showStack: true
    }
  },
  logger: {
    transports: {
      console: {
        level: 'warn',
        handleExceptions: true,
        colorize: true,
        json: true
      },
      elasticsearch: {
        level: 'silly',
        index: 'logs',
        clientOpts: {
          host: 'elasticsearch:9200'
        }
      }
    }
  }
}
