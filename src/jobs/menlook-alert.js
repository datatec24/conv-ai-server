const jobs = require('../services/jobs')
const logger = require('../services/logger')
const Bot = require('../models/bot')
const User = require('../models/user')
const MessengerBot = require('messenger-bot')

let botId = process.env.NODE_ENV === 'development' ? '58372f4da8cd0700630bdaab' : '5824adcbc010f00007fd4ec0'

jobs().then(agenda => {
  agenda.define('menlook-alert', (job, done) => {
    new Promise((resolve, reject) => {
      Bot.findById(botId, (err, bot) => {
        if (err) throw reject(err)
        User.find({[`context.${botId}.registration`]: {$exists: true}}).exec()
        .then((users) => {
          users.forEach((user) => {
            let userId = user.messenger.id
            let cutoff = (new Date() - user.context[botId].registration) / 1000 / 60 / 60
            if (cutoff >= 23 && cutoff <= 25) {
              new MessengerBot(bot.messenger).sendMessage(userId, {
                attachment: {
                  type: 'template',
                  payload: {
                    template_type: 'button',
                    text: `Tu n'as pas encore trouvé ton bonheur avec ma sélection ? Pas de souci, tu peux aller voir notre Boutique de Noël, tu trouveras tout ce qu'il te faut ;)`,
                    buttons: [{
                      type: 'web_url',
                      title: "C'est parti!",
                      url: 'http://www.menlook.com/fr/noel.html?promon=la-boutique-noel-S46-16&promop=home7&promoid=home7-la-boutique-noel-S46-16'
                    }]
                  }
                }
              }, (err) => {
                if (err) throw reject(err)
              })
            }
          })
          resolve()
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

  agenda.every('2 hours', 'menlook-alert')
})
.catch(logger.error)
