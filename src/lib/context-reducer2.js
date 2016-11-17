const { wrap } = require('co')
const Product = require('../models/product')
const Mobile = require('../models/mobile')
const User = require('../models/user')
const cron = require('node-cron')


module.exports = wrap(function* (messenger, user, context = {}, action = { type: 'NOOP' }) {
  const reply = messenger.sendMessage.bind(messenger, user.messenger.id)
  switch (action.type) {
    case 'START':
    case 'RESET': {

      const context = Object.assign({}, {
        page_brand: 0,
        page_phone:0,
        _expect: [{
          actionType: 'WRITE_PHONE',
          dataType: 'regex',
          regex: /./
        },
        {
          actionType: 'STOP',
          dataType: 'regex',
          regex: RegExp('sto[p]*', 'ig')
        }]
      })

      yield reply({
        text: `Hello ${user.profile.firstName}, I'm Kunle, your phone hunter.\nI can propose you some phone 📱 and set alert ⏰  when there is promotion 🚀🚀 :)\nOf course my work is totally free ;)`
      })

      yield reply({
        text: `Ok so tell me more about what you want, do you already know which phone you want ?`
      })

      yield reply({
        text: `If you don't, you can choose one of your favorite brand below`
      })

      const mobiles = yield Mobile
        .aggregate({$group: {_id: '$brand',brand_image: { $first : "$brand_image" }}})
        // .skip((context.page_brand || 0) * 2)
        // .limit(2)
        .exec()
        .then(function(data){
          console.log('brand',data)
          context.brand_to_propose = data
          return data
        })

      console.log(context)
      yield reply(yield sendBrand(context))

      return context
    }

    case 'NEXT_BRAND': {
      const newContext = Object.assign({}, context, {
        page_brand: context.page_brand + 1,
        _expect: [{
                  actionType: 'STOP',
                  dataType: 'regex',
                  regex: RegExp('sto[p]*', 'ig')
                }]
      })
      console.log('contextr brand au debut',newContext)

      yield reply(yield sendBrand(newContext))
      return newContext
    }

    case 'WRITE_PHONE':{
      const text = action.text

      yield result = Mobile.find({
        $where: new Function(`return !!'${action.data.text.replace("'", '')}'.match(RegExp(this.pattern, 'ig'))`)
      })
      // .skip(context.page_phone * 2  || 0)
      // .limit(2)
      .exec()
      // .then(function(data){
      //   return data.filter((element) => {
      //   let pattern = element.pattern
      //   return 'iphone'.match(RegExp(pattern,'ig'))
      //   })},function(){console.log("rejected")})
      .then(function(data){
        context.product_to_propose = data
        return data
      })


      console.log('contexte', result)
      yield reply (yield sendSelection(context))

      return Object.assign({}, context, {
        _expect: [{
                  actionType: 'STOP',
                  dataType: 'regex',
                  regex: RegExp('sto[p]*', 'ig')
                }]
      })

    }

    case 'NEXT_PHONE':{
      newContext = Object.assign({}, context, action.data, {
        page_phone: context.page_phone + 1
      })
      console.log('------ICIIIII',newContext)
      yield reply (yield sendSelection(newContext))

      return newContext
    }

    case 'SELECT_BRAND':{

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

      return Object.assign({}, context, action.data)
    }

    case 'SELECT_PRICE_RANGE': {
      console.log('-----------SELECT_PRICE_RANGE')
      context = Object.assign({}, context, action.data, {
        page_phone: 0
      })

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
        // .skip((context.page_phone || 0) * 2)
        // .limit(2)
        .exec()
        .then(function(data){
          context.product_to_propose = data
          return data
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

    case 'STOP':{
      if (!user.subscription){

        yield reply({text: "You don't have any subscription"})

        return context
      }

      else{

        yield User.findOneAndUpdate({ _id: user.id },{
          $set:{
            subscription:[]
          }
        }).exec()

        yield reply({text: "You have successfully unsubscribed ;)"})

        return context
      }

      break
    }

    case 'SET_ALERT_PRICE': {


      if (!user.subscription || user.subscription.length===0){

        console.log('hereeeeee',user,user.id)
        yield User.findOneAndUpdate({ _id: user.id },{
          $set:{
            subscription:context.product_to_propose
          }
        }).exec()


        yield reply({text: "You are now subscribed :)\nYou will receive new selection everyday at 12pm :)\nTo stop send 'Stop'"})

        return context
      }



        else{
          reply({text: "Already subscribed :)\nTo stop send 'Stop'"})
          return context
        }

      break
    }

    case 'NOT_SET_PRICE':{
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

      return context
    }

    case 'INFO':{

      yield reply({
        attachment:{
          type:"template",
          payload:{
            template_type:"button",
            text:`Keys Feature :\n${action.data.mobile.model}`,
            buttons:[
              {
                type: 'web_url',
                title: 'Acheter',
                url:`${action.data.mobile.link}`
              },
              {
                type: 'phone_number',
                title: 'Appeler Jumia',
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

  mobiles = context.brand_to_propose.slice(context.page_brand * 2  || 0,(context.page_brand * 2  || 0)+2)
  // let mobiles = context.product_to_propose.slice(context.page_phone * 2  || 0)
  console.log('mobiles of SendSelection',mobiles)


  console.log('---------------', mobiles)
  if(mobiles.length > 0){
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
            image_url: 'http://iconshow.me/media/images/Mixed/Free-Flat-UI-Icons/png/512/plus-24-512.png',
            buttons: [{
              type: 'postback',
              title: 'Autres choix',
              payload: JSON.stringify({
                type: 'NEXT_BRAND'
              })
            }]
          }])
        }
      }
    }
  }

  else {
    return {
      text: `That all the brands i have :( Please select one of them to pursue ;)`
    }
  }
}



function* sendSelection (context){
  console.log('page',context.page_phone)
  let convert_promise = yield context.product_to_propose
  console.log('mobile 1', 1)
  mobiles = convert_promise.slice(context.page_phone * 2  || 0,(context.page_phone * 2  || 0)+2)
  // let mobiles = context.product_to_propose.slice(context.page_phone * 2  || 0)
  console.log('mobiles of SendSelection',mobiles)

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
          })).concat([{
              title:'En voir plus',
              image_url: 'http://iconshow.me/media/images/Mixed/Free-Flat-UI-Icons/png/512/plus-24-512.png',
              buttons: [{
                type: 'postback',
                title: 'More choices',
                payload: JSON.stringify({
                  type: 'NEXT_PHONE'
                })
              },
              {
                type:'postback',
                title:'Set Alert Price',
                payload:JSON.stringify({
                  type:'SET_ALERT_PRICE'
                })
              }
            ]
          }])
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
