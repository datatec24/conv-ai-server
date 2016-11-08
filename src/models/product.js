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
  brand: {
    type: String
  },
  price: {
    type: Number
  },
  quantity: {
    type: Number
  },
  link: {
    type: String
  },
  imageUrl: {
    type: String
  },
  gender: {
    type: String
  },
  age: {
    type: Number
  },
  style: {
    type: String
  },
  category: {
    type: String
  }
})
