const { wrap } = require('co')
const Product = require('../models/product')
const Mobile = require('../models/mobile')
const cron = require('node-cron')

module.exports = wrap(function* (messenger, user, context = {}, action = { type: 'NOOP' }) {
  const reply = messenger.sendMessage.bind(messenger, user.messenger.id)
  console.log('dans le reducer', action)
  switch (action.type) {
    case 'START':
    case 'RESET': {
      const newContext = Object.assign({}, context, action.data, {
        page_brand: 0
      })

      yield reply({
        text: `Hello ${user.profile.firstName}, I'm Kunle, your phone hunter. I can propose you some phone 📱 and set alert ⏰  when there is promotion 🚀🚀 :) Of course my work is totally free ;)`
      })

      yield reply({
        text: `Ok so tell me more about what you want, do you already know which phone you want ?`
      })

      yield reply({
        text: `If not you can choose one of your favorite brand below`
      })

      yield reply(yield brandCarousel(context))

      // yield reply({
      //   attachment: {
      //     type: 'template',
      //     payload: {
      //       template_type: 'list',
      //       top_element_style: "compact",
      //       elements: [{
      //         title: 'Apple',
      //         image_url:'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg' ,
      //         default_action: {
      //           type: 'web_url',
      //           url: 'https://menlook.com',
      //           messenger_extensions: true,
      //           webview_height_ratio: 'tall'
      //           }
      //         },
      //         {
      //           title: 'Apple',
      //           image_url:'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg' ,
      //           default_action: {
      //             type: 'web_url',
      //             url: 'https://menlook.com',
      //             messenger_extensions: true,
      //             webview_height_ratio: 'tall'
      //             }
      //         }
      //       ],
      //       buttons: [{
      //         type: 'postback',
      //         title: 'Voir plus',
      //         payload: JSON.stringify({
      //           type: 'NEXT_PAGE'
      //         })
      //       }]
      //     }
      //   }
      // })

      return newContext
    }

    case 'NEXT_BRAND': {
      const newContext = Object.assign({}, context, action.data, {
        page_brand: context.page_brand + 1
      })

      yield reply(yield brandCarousel(newContext))
      return newContext
    }

    case 'SELECT_BRAND': {
      yield reply({
        text: `Ok ${action.data.brand} is nice :) and what is your budget ?`,
        quick_replies: [{
          content_type: 'text',
          title: '- de 50€',
          payload: JSON.stringify({
            type: 'SELECT_PRICE_RANGE',
            data: {
              priceRange: [0, 50]
            }
          })
        }, {
          content_type: 'text',
          title: '50-100€',
          payload: JSON.stringify({
            type: 'SELECT_PRICE_RANGE',
            data: {
              priceRange: [50, 100]
            }
          })
        }, {
          content_type: 'text',
          title: '100-200€',
          payload: JSON.stringify({
            type: 'SELECT_PRICE_RANGE',
            data: {
              priceRange: [100, 1000]
            }
          })
        }, {
          content_type: 'text',
          title: 'No limit',
          payload: JSON.stringify({
            type: 'SELECT_PRICE_RANGE',
            data: {
              priceRange: [0, Number.MAX_SAFE_INTEGER]
            }
          })
        }]
      })

      return Object.assign({}, context, action.data)
    }

    case 'SELECT_PRICE_RANGE': {
      console.log('-----------SELECT_PRICE_RANGE')
      const newContext = Object.assign({}, context, action.data, {
        page_mobile: 0
      })

      yield reply(yield mobileCarousel(newContext))
      return newContext
    }

    case 'NEXT_MOBILE': {
      const newContext = Object.assign({}, context, action.data, {
        page_mobile: context.page_mobile + 1
      })

      yield reply(yield mobileCarousel(newContext))
      return newContext
    }

    case 'SET_ALERT_PRICE': {
      console.log('dans set alert', context.set_alert)

      if (!context.set_alert) {
        yield reply({text: 'Subscribe sucessfull'})

        cron.schedule('* * 12 * * *', function () {
          reply({text: "Voila les alertes pricing qu'on a"})
        })

        return Object.assign({}, context, {
          set_alert: true
        })
      }

      if (context.set_alert === true) {
        yield reply({text: 'Already subribed to stop send stop'})
        return context
      }
    }

    case 'NOOP':
      return context

    case 'UNKNOWN':
    default: {
      yield reply({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: `Je suis désolé, je suis encore trop jeune pour comprendre ce que tu me demandes. Je propose de suivre pas à pas mes questions. Si tu veux réinitilaiser la conversation clique sur le bouton ci-apres. Merci de ta compréhension.`,
            buttons: [{
              type: 'postback',
              title: 'Réinitilaiser',
              payload: JSON.stringify({ type: 'RESET' })
            }]
          }
        }
      })

      return context
    }

  }
})

function* brandCarousel (context) {
  const mobiles = yield Mobile
    .aggregate({$group: {_id: '$brand'}})
    .skip((context.page_brand || 0) * 2)
    .limit(2)
    .exec()
  console.log('---------------', mobiles)
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: mobiles.map(mobile => ({
          title: mobile._id,
          image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
          buttons: [{
            type: 'postback',
            title: mobile._id,
            payload: JSON.stringify({
              type: 'SELECT_BRAND',
              data: { brand: mobile._id }
            })
          }]
        })).concat([{
          title: 'En voir plus',
          image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
          buttons: [{
            type: 'postback',
            title: 'Autres choix',
            payload: JSON.stringify({
              type: 'NEXT_BRAND'
            })
          }]
        }

            ])
      }
    }
  }
}

function* mobileCarousel (context) {
  const mobiles = yield Mobile
    .find({$and: [
      {
        brand: {
          $eq: context.brand
        }
      },
      {
        price: {
          $gt: context.priceRange[0],
          $lt: context.priceRange[1]
        }
      }
    ]})
    .skip((context.page_mobile || 0) * 2)
    .limit(2)
    .exec()

  console.log('mobile carousel', mobiles)
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: mobiles.map(mobile => ({
          title: `${mobile.model} - ${mobile.brand}`,
          subtitle: `${mobile.price} €`,
          image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
          buttons: [{
            type: 'postback',
            title: 'Acheter',
            payload: JSON.stringify({
              type: 'NEXT_STEP',
              data: { brand: mobile.model }
            })
          },
          {
            type: 'postback',
            title: "Plus d'infos",
            payload: JSON.stringify({
              type: 'INFO',
              data: { brand: mobile.model }
            })
          },
          {
            type: 'phone_number',
            title: 'Appeler Jumia',
            payload: '+33668297514'
          }
              ]
        })).concat([{
          title: 'En voir plus',
          image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
          buttons: [{
            type: 'postback',
            title: 'Autres choix',
            payload: JSON.stringify({
              type: 'NEXT_MOBILE'
            })
          },
          {
            type: 'postback',
            title: 'Set Alert Price',
            payload: JSON.stringify({
              type: 'SET_ALERT_PRICE'
            })
          }
              ]
        }

            ])
      }
    }
  }
}
