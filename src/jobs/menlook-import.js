const request = require('request')
const csv = require('csv-stream')

const jobs = require('../services/jobs')
const logger = require('../services/logger')
const Product = require('../models/product')

const uri = 'http://flux.lengow.com/shopbot/google-shopping-online-products-fr/LGW-3599287e22ce5cb141c1067e519e17c3/csv/'

jobs().then(agenda => {
  agenda.define('menlookImport', (job, done) => {
    new Promise((resolve, reject) => {
      const csvStream = csv.createStream({
        delimiter: '|'
      })
      csvStream._encoding = 'latin1'

      request(uri)
      // require('fs').createReadStream('/opt/conv.ai/menlook.csv')
        .pipe(csvStream)
        .on('data', product => {
          Product.findOneAndUpdate({
            importId: product.id
          }, {
            importId: product.id,
            title: product.title,
            brand: product.brand,
            price: product.sale_price,
            quantity: isNaN(product.custom_label_0) ? 0 : parseInt(product.custom_label_0, 10),
            link: product.link,
            imageUrl: product.image_link,
            gender: {
              'Homme': 'male',
              'Femme': 'female',
              'Unisexe': null
            }[product.gender] || null,
            age: isNaN(product.age_group) ? 0 : parseInt(product.age_group, 10),
            style: product.pattern,
            category: product.custom_label_3
          }, {
            upsert: true
          }).exec().catch(logger.error)
        })
        .on('error', reject)
        .on('end', resolve)
    })
    .then(() => done())
    .catch(err => {
      logger.error(err)
      done(err)
    })
  })

  agenda.every('2 hours', 'menlookImport')
  // agenda.now('menlookImport')
})
.catch(logger.error)
