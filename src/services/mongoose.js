const url = require('url')
const mongoose = require('mongoose')
const config = require('./config')

mongoose.Promise = Promise

module.exports = mongoose.connect(process.env.MONGOHQ_URL || url.format(config.get('mongodb:server')))
