const mongoose = require('../services/mongoose')

module.exports = mongoose.model('Product', {
  importId: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
