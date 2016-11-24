const mongoose = require('../services/mongoose')

module.exports = mongoose.model('User', {
  profile: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    }
  },
  messenger: {
    id: {
      type: String,
      required: true
    }
  },
  context: mongoose.Schema.Types.Mixed
})
