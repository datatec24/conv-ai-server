const { wrap } = require('co')
const Mobile = require('../../models/mobile')

const delay = (ms) => {
  let ctr
  let rej

  const p = new Promise(function (resolve, reject) {
    ctr = setTimeout(resolve, ms)
    rej = reject
  })

  p.cancel = () => {
    clearTimeout(ctr)
    rej(new Error('Cancelled'))
  }

  return p
}

module.exports = wrap(function* (messenger, user, context = {}, action = { type: 'NOOP' }) {
  const reply = messenger.sendMessage.bind(messenger, user.messenger.id)
  switch (action.type) {
    case 'START':
    case 'RESET': {
      context = Object.assign({}, {
        page_brand: 0,
        page_phone: 0,
        subscription: !context.subscription ? [] : context.subscription,
        _expect: [{
          actionType: 'WRITE_PHONE',
          dataType: 'string',
          dataKey: 'text',
          matches: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x']
        },
        {
          actionType: 'STOP',
          dataType: 'regex',
          regex: /sto[p]*/ig
        },
        {
          actionType: 'RESET',
          dataType: 'string',
          dataKey: 'wakeup',
          matches: ['wake', 'wake up']
        }]
      })

      yield reply({
        text: `Hello ${user.profile.firstName}, I'm Kunle, your phone hunter📱 :)`

      })

      yield delay(1000)

      yield reply({
        text: `Here is what I can do for you. I will negotiate the price and alert ⏰ you when I have a deal🚀🚀, are you interested?\nI will not take a commission :)`,
        quick_replies: [{
          content_type: 'text',
          title: 'Yes',
          payload: JSON.stringify({
            type: 'GO'
          })
        }, {
          content_type: 'text',
          title: 'No',
          payload: JSON.stringify({
            type: 'SLEEP'
          })
        }]

      })

      return context
    }

    case 'GO': {
      yield reply({
        text: `Ok so tell me more about what you want, do you already know which phone you want ?`
      })

      yield delay(2000)

      yield reply({
        text: `If you don't, you can choose one of your favorite brand below`
      })

      yield delay(2000)

      yield Mobile
        .aggregate({$group: {_id: '$brand', brand_image: { $first: '$brand_image' }}})
        // .skip((context.page_brand || 0) * 2)
        // .limit(2)
        .exec()
        .then(function (data) {
          context.brand_to_propose = data
          return data
        })

      yield reply(yield sendBrand(context))

      return context
    }

    case 'SLEEP': {
      yield reply({
        text: `I can only hunt phones ${user.profile.firstName}... Say 'Kunle wake up' so I can hunt a deal for you. In the meantime, I go home.`
      })

      return context
    }

    case 'NEXT_BRAND': {
      const newContext = Object.assign({}, context, {
        page_brand: context.page_brand + 1
      })

      yield reply(yield sendBrand(newContext))
      return Object.assign({}, newContext)
    }

    case 'WRITE_PHONE': {
      yield Mobile.find({})
      .exec()
      .then(function (data) {
        context.product_to_propose = data.filter((element) => {
          let pattern = element.pattern
          let result = action.data.text.match(RegExp(pattern, 'ig'))
          return result
        })
        return context.product_to_propose
      }, function (rejection) { return rejection })

      yield reply({
        text: `Ok ${user.profile.firstName}, this models are hot in the market:`
      })

      yield reply(yield sendSelection(context))

      return Object.assign({}, context, {_expect: [{
        actionType: 'STOP',
        dataType: 'regex',
        regex: /sto[p]*/ig
      },
      {
        actionType: 'RESET',
        dataType: 'string',
        dataKey: 'wakeup',
        matches: ['wake', 'wake up']
      }]})
    }

    case 'NEXT_PHONE': {
      let newContext = Object.assign({}, context, action.data, {
        page_phone: context.page_phone + 1
      })
      yield reply(yield sendSelection(newContext))

      return newContext
    }

    case 'SELECT_BRAND': {
      yield reply({
        text: `Ok ${action.data.brand} is nice :) and what is your budget ?`,
        quick_replies: [{
          content_type: 'text',
          title: '- de 100 000 ₦',
          payload: JSON.stringify({
            type: 'SELECT_PRICE_RANGE',
            data: {
              priceRange: [0, 100000]
            }
          })
        }, {
          content_type: 'text',
          title: '100 000 - 200 000 ₦',
          payload: JSON.stringify({
            type: 'SELECT_PRICE_RANGE',
            data: {
              priceRange: [100000, 200000]
            }
          })
        }, {
          content_type: 'text',
          title: '+ de 200 000 ₦',
          payload: JSON.stringify({
            type: 'SELECT_PRICE_RANGE',
            data: {
              priceRange: [200000, 100000000000]
            }
          })
        }]
      })

      return Object.assign({}, context, action.data, context, {
        _expect: [{
          actionType: 'STOP',
          dataType: 'regex',
          regex: /sto[p]*/ig
        },
        {
          actionType: 'RESET',
          dataType: 'string',
          dataKey: 'wakeup',
          matches: ['wake', 'wake up']
        }]
      })
    }

    case 'SELECT_PRICE_RANGE': {
      context = Object.assign({}, context, action.data, {
        page_phone: 0
      })

      yield Mobile
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
        .exec()
        .then(function (data) {
          context.product_to_propose = data
          return data
        })
      yield reply({
        text: `Ok ${user.profile.firstName}, this models are hot in the market:`
      })
      yield reply(yield sendSelection(context))
      return context
    }

    case 'NEXT_MOBILE': {
      const newContext = Object.assign({}, context, action.data, {
        page_phone: context.page_phone + 1
      })

      yield reply(yield sendSelection(newContext))
      return newContext
    }

    case 'STOP': {
      if (!context.subscription || context.subscription.length === 0) {
        yield reply({text: "You don't have any alert set"})

        return context
      } else {
        context.subscription = []

        yield reply({text: 'You have successfully unsubscribed for your alerts ;)'})

        return context
      }
    }

    case 'SET_ALERT_PRICE': {
      context.subscription = context.product_to_propose.filter(element => {
        return (element.id === action.data.mobile.id)
      })

      yield reply({text: `Ok ${user.profile.firstName}, I will hunt a better deal for ${action.data.mobile.model} , and will alert you when I have a better price. To stop alert, please send 'Stop'`})

      yield reply({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: `What do you want to do?`,
            buttons: [
              {
                type: 'phone_number',
                title: 'Call Jumia',
                payload: '+33668297514'
              },
              {
                type: 'postback',
                title: 'More choices',
                payload: JSON.stringify({
                  type: 'NEXT_PHONE'
                })
              }
            ]
          }
        }
      })

      return context
    }

    case 'NOT_SET_PRICE': {
      yield reply({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: `No problem :) Come back whenever you want :)`,
            buttons: [{
              type: 'postback',
              title: 'New conversation',
              payload: JSON.stringify({ type: 'RESET' })
            }]
          }
        }
      })

      return Object.assign({}, context, action.data)
    }

    case 'INFO': {
      yield reply({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: `Keys Feature :\n${action.data.mobile.description}`,
            buttons: [
              {
                type: 'web_url',
                title: 'Buy',
                url: `${action.data.mobile.link}`
              },
              {
                type: 'postback',
                title: 'Go hunt better deal',
                payload: JSON.stringify({
                  type: 'SET_ALERT_PRICE',
                  data: {
                    mobile: action.data.mobile
                  }
                })
              },
              {
                type: 'postback',
                title: 'More choices',
                payload: JSON.stringify({
                  type: 'NEXT_PHONE'
                })
              }
            ]
          }
        }
      })

      return Object.assign({}, context, action.data)
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
            text: `Sorry I don't get it, can you please follow the steps of my questions.\nTo start a new conversation click the button below`,
            buttons: [{
              type: 'postback',
              title: 'New conversation',
              payload: JSON.stringify({ type: 'RESET' })
            }]
          }
        }
      })

      return context
    }
  }
})

function* sendBrand (context) {
  let mobiles = context.brand_to_propose.slice(context.page_brand * 3 || 0, (context.page_brand * 3 || 0) + 3)

  if (mobiles.length > 0) {
    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: mobiles.map(mobile => ({
            title: mobile._id,
            image_url: mobile.brand_image,
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
            image_url: 'http://4.bp.blogspot.com/-US3GOtMVxmw/Ts9semOx6kI/AAAAAAAABJs/w6iqw1ix8-o/s1600/signe-plus.gif',
            buttons: [{
              type: 'postback',
              title: 'More choices',
              payload: JSON.stringify({
                type: 'NEXT_BRAND'
              })
            }]
          }])
        }
      }
    }
  } else {
    return {
      text: `That all the brands i have :( Please select one of them to pursue ;)`
    }
  }
}

function* sendSelection (context) {
  let convertpromise = yield context.product_to_propose
  let mobiles = convertpromise.slice(context.page_phone * 2 || 0, (context.page_phone * 2 || 0) + 2)

  if (mobiles.length > 0) {
    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: mobiles.map(mobile => ({
            title: `${mobile.model} - ${mobile.brand}`,
            subtitle: `₦ ${mobile.price}`,
            image_url: `${mobile.image}`,
            buttons: [{
              type: 'web_url',
              title: 'Buy',
              url: `${mobile.link}`
            },
            {
              type: 'postback',
              title: 'More info',
              payload: JSON.stringify({
                type: 'INFO',
                data: {
                  mobile: mobile
                }
              })
            },
            {
              type: 'postback',
              title: 'Go hunt better deal',
              payload: JSON.stringify({
                type: 'SET_ALERT_PRICE',
                data: {
                  mobile: mobile
                }
              })
            }
            ]
          })).concat([{
            title: 'Other options',
            image_url: 'http://4.bp.blogspot.com/-US3GOtMVxmw/Ts9semOx6kI/AAAAAAAABJs/w6iqw1ix8-o/s1600/signe-plus.gif',
            buttons: [{
              type: 'postback',
              title: 'More choices',
              payload: JSON.stringify({
                type: 'NEXT_PHONE'
              })
            },
            {
              type: 'phone_number',
              title: 'Appeler Jumia',
              payload: '+33668297514'
            }]
          }])
        }
      }
    }
  } else {
    return {
      text: `I don't have any more mobile to propose matching your query :(\nPlease select an other brand below or price :)\n`,
      quick_replies: [{
        content_type: 'text',
        title: '- de 100 000 ₦',
        payload: JSON.stringify({
          type: 'SELECT_PRICE_RANGE',
          data: {
            priceRange: [0, 100000]
          }
        })
      }, {
        content_type: 'text',
        title: '100 000 - 200 000 ₦',
        payload: JSON.stringify({
          type: 'SELECT_PRICE_RANGE',
          data: {
            priceRange: [100000, 200000]
          }
        })
      }, {
        content_type: 'text',
        title: '+ de 200 000 ₦',
        payload: JSON.stringify({
          type: 'SELECT_PRICE_RANGE',
          data: {
            priceRange: [200000, 100000000000]
          }
        })
      }]
    }
  }
}
