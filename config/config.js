// Those values are loaded from `.env` file.
const DOT_ENV = undefined

module.exports = {
  application: {
    name: 'conv.ai'
  },
  server: {
    port: 3000,
    timeout: 2000
  },
  mongo: {
    server: {
      hostname: DOT_ENV,
      port: DOT_ENV
    }
  },
  elasticsearch: {
    server: {
      hostname: DOT_ENV,
      port: DOT_ENV
    },
    index: 'conv.ai'
  },
  logger: {
    transports: {}
  },
  messenger: {
    bot: {
      token: DOT_ENV,
      verify: DOT_ENV,
      app_secret: DOT_ENV
    }
  }
}
