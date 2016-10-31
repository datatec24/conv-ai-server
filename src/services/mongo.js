const url = require('url')
const { MongoClient } = require('mongodb')

const config = require('./config')
const logger = require('./logger')

/**
 * Expose module
 */

module.exports = MongoClient
  .connect(url.format(config.get('mongo:server')))
  .then(db => {
    logger.info('[mongo] Connected successfully to server')
    process.once('exit', () => db.close())
    return db
  })
  .catch(err => {
    logger.error(err)
    // Do not shallow error
    throw err
  })
