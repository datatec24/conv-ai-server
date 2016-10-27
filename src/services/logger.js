const R = require('ramda')
const winston = require('winston')
const config = require('./config')

/**
 * Avaliable transports.
 */

const transports = {
  console: winston.transports.Console,
  memory: winston.transports.Memory,
  elasticsearch: require('winston-elasticsearch')
}

/**
 * Expose module.
 */

function getTransports () {
  return R.compose(
    R.filter(t => !!t),
    R.map(t => {
      const options = config.get('logger:transports:' + t)
      if (options) return new (transports[t])(options)
    })
  )(Object.keys(config.get('logger:transports')))
}

module.exports = new (winston.Logger)({
  transports: getTransports(),
  exitOnError: false
})
