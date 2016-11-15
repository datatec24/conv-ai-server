const mongoose = require('../services/mongoose')

module.exports = mongoose.model('Mobile', {
  id: String,
  brand: String,
  model: String,
  price: Number,
  image:String,
  description:String,
  link:String,
  pattern:String
})
