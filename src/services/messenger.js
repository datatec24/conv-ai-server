const R = require('ramda')
const co = require('co')
const MessengerBot = require('messenger-bot')

const logger = require('./logger')
const User = require('../models/user')
const contextReducer = require('../lib/context-reducer')
const conversation = require('../lib/conversation')

const messengerBots = []

module.exports = bot => {
  if (messengerBots[bot.id]) return messengerBots[bot.id]

  const messenger = messengerBots[bot.id] = new MessengerBot(bot.messenger)

  /**
   * Get a single user based on his messenger id
   */

  const getUser = co.wrap(function* (messengerId) {
    let user = yield User.findOne({ messenger: { id: messengerId } }).exec()

    if (!user) {
      const {
        first_name: firstName,
        last_name: lastName,
        gender
      } = yield messenger.getProfile(messengerId)

      user = yield new User({
        profile: {
          firstName,
          lastName,
          gender
        },
        messenger: {
          id: messengerId
        },
        context: {}
      }).save()
    }

    return user
  })

  /**
   * Apply an action to user's context
   */

  const applyAction = co.wrap(function* (messengerId, action) {
    const user = yield getUser(messengerId)
    const context = yield contextReducer(R.propOr({}, bot.id, user.context || {}), action)

    yield User.update({ _id: user.id }, {
      $set: {
        [`context.${bot.id}`]: context
      }
    })

    return context
  })

  /**
   * Get the message to send to user based on it's current context
   */

  const getMessage = conversation(bot)

  /**
   * Log all events
   */

  ;[
    'message',
    'postback',
    'delivery',
    'authentication'
  ].forEach(eventName => {
    messenger.on(eventName, data => {
      logger.info(`[messenger#${eventName}] Received ${eventName}`, {
        bot: {
          id: bot.id,
          name: bot.name
        },
        data
      })
    })
  })

  /**
   * Handle events
   */

  messenger.on('message', ({ sender, message }, reply, actions) => co(function* () {
    const action = {
      type: message.text.toLowerCase() === 'reset' ? 'RESET' : 'NOOP'
    }

    const context = yield applyAction(sender.id, action)
    const responses = yield getMessage(context)

    while (responses.length) yield reply(responses.pop())
  }).catch(logger.error))

  messenger.on('postback', ({ sender, postback }, reply, actions) => co(function* () {
    const context = yield applyAction(sender.id, JSON.parse(postback.payload))
    const responses = yield getMessage(context)

    while (responses.length) yield reply(responses.pop())
  }).catch(logger.error))

  return messenger
}
