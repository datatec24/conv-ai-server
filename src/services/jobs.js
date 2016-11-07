const url = require('url')
const co = require('co')
const Agenda = require('agenda')
const config = require('./config')

const jobs = co(function* () {
  const agenda = new Agenda({
    db: {
      address: process.env.MONGOHQ_URL || url.format(config.get('mongodb:server'))
    }
  })

  yield new Promise((resolve, reject) => {
    agenda.once('error', reject)
    agenda.once('ready', resolve)
  })

  // remove stale jobs
  yield agenda._collection.update({
    lockedAt: {
      $exists: true
    }
  }, {
    $set: {
      lockedAt: null
    }
  }, {
    multi: true
  })

  agenda.start()

  return agenda
})

module.exports = () => jobs
