const mongoose = require('../services/mongoose')

module.exports = mongoose.model('Mobile', {
  id: String,
  brand: String,
  model: String,
  price: Number,
  description: String,
  link: String
})
