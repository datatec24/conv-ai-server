const jobs = require('../services/jobs')
const logger = require('../services/logger')
const Product = require('../models/product')
const User = require('../models/user')
const MessengerBot = require('../services/messenger')
const Bot = require('../models/bot')

function sendSelection (products){
  mobiles = products.slice(0,3)
  // let mobiles = context.product_to_propose.slice(context.page_phone * 2  || 0)
  console.log('mobiles of Send Selection',mobiles)

  if(mobiles.length > 0){
    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: mobiles.map(mobile => ({
              title:`${mobile.model} - ${mobile.brand}`,
              subtitle:`₦ ${mobile.price}`,
              image_url: `${mobile.image}`,
              buttons: [{
                type: 'web_url',
                title: 'Acheter',
                url:`${mobile.link}`
              },
              {
                type: 'postback',
                title: "Plus d'infos",
                payload: JSON.stringify({
                  type: 'INFO',
                  data: {
                    mobile: mobile
                  }
                })
              },
              {
                type: 'phone_number',
                title: 'Appeler Jumia',
                payload: '+33668297514'
              }
            ]
          }))
        }
      }
    }
  }
  else{
    return {
      text: `I don't have any more mobile to propose :( but do you want to be alerted as soon as i have more?`,
      quick_replies: [{
        content_type: 'text',
        title: 'oui',
        payload: JSON.stringify({
          type: 'SET_ALERT_PRICE'
        })
      }, {
        content_type: 'text',
        title: 'non',
        payload: JSON.stringify({
          type: 'NOT_SET_PRICE'
        })
      }]
    }

}
}

jobs().then(agenda => {

  console.log('subscription starttttt')

  agenda.define('subscription', (job, done) => {
    console.log('------------envoie de message en masse!!!-----------------')
    new Promise((resolve, reject) => {
      console.log('1 Bot',Bot)
      Bot.findById("58234e59bec50a3e10b5208c",(err,bot)=>{
        console.log(bot)
        let search =  User.find({ subscription: { $exists: true }}).exec()
        .then((users) =>{
          console.log('Users qui ont souscriiiiiiiit',users)
          users.forEach((user)=>{
            let userId = user.messenger.id
            let products = user.subscription
            console.log('product',products)
            if(products.length>0){
              MessengerBot(bot).sendMessage(userId, {text:"Here is a fresh selection of our mobile "},()=>{
                MessengerBot(bot).sendMessage(userId, sendSelection(products),()=>{
                  resolve()
                })
              })
            }
          })
        })
      })
    })
    .then(() => {
      console.log('-------fin du job------')
      done()
    })
    .catch(err => {
      console.log('-------fin du job avec erreur------')
      logger.error(err)
      done(err)
    })
  })


  agenda.every('* 13 * * *', 'subscription')
  // agenda.now('menlookImport')
})
.catch(logger.error)
