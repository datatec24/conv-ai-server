const bodyParser = require('body-parser')
const createError = require('http-errors')

const Bot = require('../../models/bot')
const messenger = require('../../services/messenger')

module.exports = router => {
  /**
   * Bot loader
   */

  router.use('/:botId', (req, res, next) => {
    Bot.findOne({ _id: req.params.botId }).exec()
      .then(bot => {
        if (!bot) throw createError(404)
        Object.assign(req, { bot })
        next()
      })
      .catch(next)
  })

  /**
   * Bot status page
   */

  router.get('/:botId/_status', (req, res) => {
    res.send({ status: 'ok' })
  })

  /**
   * Bot verification
   */

  router.get('/:botId', ({ bot, query }, res, next) => {
    if (bot.messenger.verify !== query['hub.verify_token']) {
      return next(createError(401, 'Error, wrong validation token'))
    }

    res.send(query['hub.challenge'])
  })

  /**
   * Bot messaging core
   */

  router.post('/:botId', bodyParser.json(), ({ bot, body }, res) => {
    messenger(bot)._handleMessage(body)
    res.send({ status: 'ok' })
  })
}
