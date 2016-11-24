const jobs = require('../services/jobs')
const logger = require('../services/logger')
const User = require('../models/user')
const MessengerBot = require('../services/messenger')
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

jobs().then(agenda => {
  agenda.define('subscription_jumia', (job, done) => {
    new Promise((resolve, reject) => {
      // Comment trouver un moyen général d'avoir l'id du bot Jumia
      Bot.findById('5834d8212ea26b01fef6aff0', (err, bot) => {
        let jumiaId = bot.id
        if (err) throw err
        User.find({[`context.${bot.id}.subscription`]: {$exists: true}}).exec()
        .then((users) => {
          users.forEach((user) => {
            let userId = user.messenger.id
            let products = user.subscription
            if (products.length > 0) {
              MessengerBot(bot).sendMessage(userId, {text: 'Here is a fresh selection of our mobile '}, () => {
                MessengerBot(bot).sendMessage(userId, sendSelection(products), () => {
                  resolve()
                })
              })
            }
          })
        })
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

  agenda.every('14 1 * * *', 'subscription_jumia')
  // agenda.now('menlookImport')
})
.catch(logger.error)
