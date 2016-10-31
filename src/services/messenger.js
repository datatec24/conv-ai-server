const Bot = require('messenger-bot')
const config = require('./config')
const logger = require('./logger')

/**
 * Expose module
 */

const bot = module.exports = new Bot(config.get('messenger:bot'))

bot.on('error', logger.error)

bot.on('message', (payload, reply, actions) => {
  reply({ text: 'hey!' }, (err, info) => {
    if (err) logger.error(err)
    logger.debug('[messenger] Message sent', info)
  })
})
