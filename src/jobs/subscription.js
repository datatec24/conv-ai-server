const jobs = require('../services/jobs')
const logger = require('../services/logger')
const User = require('../models/user')
const MessengerBot = require('messenger-bot')
const Bot = require('../models/bot')

function sendSelection (products) {
  let mobiles = products.slice(0, 3)

  if (mobiles.length > 0) {
    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: mobiles.map(mobile => ({
            title: `${mobile.model} - ${mobile.brand}`,
            subtitle: `₦ ${mobile.price}`,
            image_url: `${mobile.image}`,
            buttons: [{
              type: 'web_url',
              title: 'Acheter',
              url: `${mobile.link}`
            },
            {
              type: 'postback',
              title: "Plus d'infos",
              payload: JSON.stringify({
                type: 'INFO',
                data: {
                  mobile: mobile
                }
              })
            },
            {
              type: 'phone_number',
              title: 'Appeler Jumia',
              payload: '+33668297514'
            }
            ]
          }))
        }
      }
    }
  } else {
    return {
      text: `I don't have any more mobile to propose :( but do you want to be alerted as soon as i have more?`,
      quick_replies: [{
        content_type: 'text',
        title: 'oui',
        payload: JSON.stringify({
          type: 'SET_ALERT_PRICE'
        })
      }, {
        content_type: 'text',
        title: 'non',
        payload: JSON.stringify({
          type: 'NOT_SET_PRICE'
        })
      }]
    }
  }
}

let botId = process.env.NODE_ENV === 'development' ? '5838913f014e49005843ecbc' : 'TODO'

jobs().then(agenda => {
  agenda.define('subscription_jumia', (job, done) => {
    new Promise((resolve, reject) => {
      Bot.findById(botId, (err, bot) => {
        if (err) throw reject(err)
        User.find({[`context.${botId}.subscription`]: {$exists: true}}).exec()
        .then((users) => {
          users.forEach((user) => {
            let userId = user.messenger.id
            let products = user.context[botId].subscription
            if (products.length > 0) {
              let botClass = new MessengerBot(bot.messenger)
              botClass.sendMessage(userId, {text: 'Here is a fresh selection of our mobile just for you :)'}, () => {
                if (err) reject(err)
                botClass.sendMessage(userId, sendSelection(products), () => {
                  if (err) reject(err)
                })
              })
            }
          })
          return resolve()
        })
        .catch(err => reject(err))
      })
    })
    .then(() => {
      done()
    })
    .catch(err => {
      logger.error(err)
      done(err)
    })
  })

  agenda.every('6 hours', 'subscription_jumia')
})
.catch(logger.error)
