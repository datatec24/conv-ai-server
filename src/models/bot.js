const mongoose = require('../services/mongoose')

module.exports = mongoose.model('Bot', {
  name: {
    type: String,
    required: true
  },
  messenger: {
    token: {
      type: String,
      required: true
    },
    verify: {
      type: String,
      required: true
    }
  }
})
