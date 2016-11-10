const R = require('ramda')
const co = require('co')
const MessengerBot = require('messenger-bot')

const logger = require('./logger')
const User = require('../models/user')
const contextReducer = require('../lib/context-reducer2')

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
   *
   */

  const getContext = co.wrap(function* (user) {
    const defaultContext = yield contextReducer[bot.script](messenger, user)
    return R.propOr(defaultContext, bot.id, user.context || {})
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
      console.log('eventname', data)
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
    const context = yield getContext(user)

    let action

    if (message.quick_reply) {
      action = JSON.parse(message.quick_reply.payload)
    } else {
      ;(context._expect || []).forEach(expectation => {
        switch (expectation.dataType) {
          case 'number':
            let matches = message.text.match(/[0-9]+/)

            if (matches) {
              action = {
                type: expectation.actionType,
                data: {
                  [expectation.dataKey]: parseInt(matches[0], 10)
                }
              }
            }
            break

          case 'string':
            expectation.matches.forEach(match => {
              if (message.text.toLowerCase().indexOf(match) === -1) return
              action = {
                type: expectation.actionType,
                data: {
                  [expectation.dataKey]: message.text
                }
              }
            })
            break

          case 'regex': {
            const matches = message.text.match(expectation.regex)
            if (matches) {
              action = {
                type: expectation.actionType,
                data: {
                  [expectation.dataKey]: matches[0]
                }
              }
            }
            break
          }

        }
      })
    }

    if (!action) {
      action = {
        type: 'UNKNOWN'
      }
    }

    yield User.update({ _id: user.id }, {
      $set: {
        [`context.${bot.id}`]: yield contextReducer[bot.script](messenger, user, context, action)
      }
    })
  }).catch(logger.error))

  messenger.on('postback', ({ sender, postback }, reply, actions) => co(function* () {
    const user = yield getUser(sender.id)
    console.log('postback payload', postback.payload)
    const action = JSON.parse(postback.payload)
    const context = yield getContext(user)
    console.log('dans le post back, action :', action)

    yield User.update({ _id: user.id }, {
      $set: {
        [`context.${bot.id}`]: yield contextReducer[bot.script](messenger, user, context, action)
      }
    })
  }).catch(logger.error))

  return messenger
}
