const R = require('ramda')
const co = require('co')
const MessengerBot = require('messenger-bot')

const logger = require('./logger')
const User = require('../models/user')
const contextReducer = require('../lib/context-reducer')

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
    const user = yield getUser(sender.id)
    const context = R.propOr({}, bot.id, user.context || {})

    let action

    if (context._expect) {
      switch (context._expect.dataType) {
        case 'number':
          let matches = message.text.match(/[0-9]+/)

          if (matches) {
            action = {
              type: context._expect.actionType,
              data: {
                [context._expect.dataKey]: parseInt(matches[0], 10)
              }
            }
          }
          break
      }
    }

    if (!action) {
      action = {
        type: message.text.match(/reset/i) ? 'RESET' : 'UNKNOWN'
      }
    }

    yield User.update({ _id: user.id }, {
      $set: {
        [`context.${bot.id}`]: yield contextReducer(messenger, user, context, action)
      }
    })
  }).catch(logger.error))

  messenger.on('postback', ({ sender, postback }, reply, actions) => co(function* () {
    const user = yield getUser(sender.id)
    const action = JSON.parse(postback.payload)
    const context = R.propOr({}, bot.id, user.context || {})

    yield User.update({ _id: user.id }, {
      $set: {
        [`context.${bot.id}`]: yield contextReducer(messenger, user, context, action)
      }
    })
  }).catch(logger.error))

  return messenger
}
