const Bot = require('messenger-bot')
const config = require('./config')
const logger = require('./logger')

/**
 * Expose module
 */

const bot = module.exports = new Bot(config.get('messenger:bot'))

bot.on('error', logger.error)
