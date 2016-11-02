const MessengerBot = require('messenger-bot')
const logger = require('./logger')

const messengerBots = []

function getMessengerBot (bot) {
  if (messengerBots[bot.id]) return messengerBots[bot.id]

  const messengerBot = messengerBots[bot.id] = new MessengerBot(bot.messenger)

  /**
   * Log all events
   */

  ;[
    'message',
    'postback',
    'delivery',
    'authentication'
  ].forEach(eventName => {
    messengerBot.on(eventName, payload => {
      logger.info(`[messenger#${eventName}] Received ${eventName}`, { botId: bot.id }, payload)
    })
  })

  /**
   * Handle events
   */

  messengerBot.on('message', (payload, reply, actions) => {
    reply({ text: 'hey!' })
  })

  return messengerBot
}

module.exports = {
  getMessengerBot
}
