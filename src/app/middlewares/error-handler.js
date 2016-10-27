const { STATUS_CODES } = require('http')
const R = require('ramda')
const config = require('../../services/config')

/**
 * Expose middleware.
 */

module.exports = () => {
  return (err, req, res, next) => {
    if (!R.prop('status', err)) Object.assign(err, { status: 500 })

    const error = { message: err.message || STATUS_CODES[err.status] }

    if (config.get('middlewares:errorHandler:showStack')) {
      error.stack = (err.stack || '').split('\n').filter(line => !!line)
    }

    res.status(err.status).send(error)
  }
}
