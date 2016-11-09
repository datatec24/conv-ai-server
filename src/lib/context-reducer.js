const { wrap } = require('co')
const Product = require('../models/product')

module.exports = wrap(function* (messenger, user, context = {}, action = { type: 'NOOP' }) {
  const reply = messenger.sendMessage.bind(messenger, user.messenger.id)

  switch (action.type) {
    case 'START':
    case 'RESET': {
      yield reply({
        text: `Bonjour cher${user.profile.gender === 'female' ? 'e' : ''} ${user.profile.firstName}, je m'appelle Mr Bot.`
      })

      yield reply({
        text: `Mon but est de t'aider à trouver un cadeau de noêl sympa. Je vais pour cela te poser quelques questions pour mieux comprendre ton besoin et te proposerais ensuite les produits les plus adaptés, que tu pourras acheter directement sur Menlook.com.`
      })

      yield reply({
        text: `Je suis encore tout jeune donc je te propose de suivre mes questions pour pas que je m'embrouille dans les guirlandes :).`
      })

      yield reply({
        text: 'Peux-tu me dire pour qui est ton cadeau ?'
      })

      yield reply({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: 'Une femme',
              subtitle: `C'est un humain mais pas un homme`,
              image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
              buttons: [{
                type: 'postback',
                title: 'Une femme',
                payload: JSON.stringify({
                  type: 'SELECT_GENDER',
                  data: { gender: 'female' }
                })
              }]
            }, {
              title: 'Un homme',
              subtitle: `On ne peut pas croire un mot de ce qu'ils disent`,
              image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
              buttons: [{
                type: 'postback',
                title: 'Un homme',
                payload: JSON.stringify({
                  type: 'SELECT_GENDER',
                  data: { gender: 'male' }
                })
              }]
            }]
          }
        }
      })

      return {}
    }

    case 'SELECT_GENDER': {
      if (action.data.gender === 'male') {
        yield reply({
          text: `Ok cool c'est ma spécialité les cadeaux pour hommes :). Et cet homme, c'est qui pour toi ?`
        })

        yield reply({
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [{
                title: 'Mon père',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Mon père',
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'father' }
                  })
                }]
              }, {
                title: 'Mon frère',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Mon frère',
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'brother' }
                  })
                }]
              }, {
                title: 'Mon pote',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Mon pote',
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'friend_male' }
                  })
                }]
              }, {
                title: 'Mon mec',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Mon mec',
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'husband' }
                  })
                }]
              }]
            }
          }
        })
      }

      if (action.data.gender === 'female') {
        yield reply({
          text: `Ok top chez menlook.com, même si on est un site pour hommes on a toujours sous la main une bonne séléction de produits pour femmes :). Et cette femme, c'est qui pour toi ?`
        })

        yield reply({
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [{
                title: 'Ma mère',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Ma mère',
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'mother' }
                  })
                }]
              }, {
                title: 'Ma sœur',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Ma sœur',
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'sister' }
                  })
                }]
              }, {
                title: 'Ma pote',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Ma pote',
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'friend_female' }
                  })
                }]
              }, {
                title: 'Ma conjointe',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Ma conjointe',
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'wife' }
                  })
                }]
              }]
            }
          }
        })
      }

      return Object.assign({}, context, action.data)
    }

    case 'SELECT_PERSON_TYPE': {
      if (action.data.personType === 'father') {
        yield reply({
          text: `Classe le cadeau sur menlook pour son père :). Désolé de l'indiscretion, mais peux-tu me dire quelle âge il a please?`
        })
      }

      if (action.data.personType === 'brother') {
        yield reply({
          text: `Un bon cadeau pour son fréro, c'est bon ca :). Il a quel âge ton frère en fait ?`
        })
      }

      if (action.data.personType === 'friend') {
        yield reply({
          text: `J'aimerais bien avoir des amis comme toi :). Il a quel âge ce pote ?`
        })
      }

      if (action.data.personType === 'husband') {
        yield reply({
          text: `Ok, on va se concentrer pour trouver quelque chose de bien alors :). Il a quel âge ton mec ?`
        })
      }

      if (action.data.personType === 'mother') {
        yield reply({
          text: `Sacre saint, j'ai beaucoup de poids sur les épaules, on a qu'une mère dans sa vie :). Sans indiscretion, elle a quel âge ta mère ?`
        })
      }

      if (action.data.personType === 'sister') {
        yield reply({
          text: `Un bon cadeau pour sa soeurette, c'est bon ca :). Elle a quel âge en fait ?`
        })
      }

      if (action.data.personType === 'friend_female') {
        yield reply({
          text: `J'aimerais bien avoir des amis comme toi :). Elle a quel âge cette pote ?`
        })
      }

      if (action.data.personType === 'wife') {
        yield reply({
          text: `Ok, on va se concentrer pour trouver quelque chose de bien alors :). Elle a quel âge ta conjointe ?`
        })
      }

      return Object.assign({}, context, {
        _expect: {
          actionType: 'SELECT_AGE',
          dataKey: 'age',
          dataType: 'number'
        }
      }, action.data)
    }

    case 'SELECT_AGE': {
      if (action.data.age < 10) {
        yield reply({
          text: `Aie aie aie, c'est trop jeune pour moi ca. Tu devrais aller voir chez Jouet Club :).`
        })

        return context
      }

      if (action.data.age > 100) {
        yield reply({
          text: `Malheureusement je crains que mes produits soient un peu "Jeuns" , tu devrais regarder sur un site de bridge :).`
        })

        return context
      }

      yield reply({
        text: `D'accord ça marche. Et tu as quel budget ?`,
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
              priceRange: [100, 200]
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

      return Object.assign({}, context, {
        _expect: {
          actionType: 'SELECT_PRICE_RANGE',
          dataKey: 'priceRange',
          dataType: 'number'
        }
      }, action.data)
    }

    case 'SELECT_PRICE_RANGE': {
      yield reply({
        text: `Dernière question et je te fais des propositions, quel style a ${{
          father: 'ton père',
          brother: 'ton frère',
          friend_male: 'ton pote',
          husband: 'ton mec',
          mother: 'ta mère',
          sister: 'ta sœur',
          friend_female: 'ta pote',
          wife: 'ta conjointe'
        }[context.personType]} ?`
      })

      if (context.gender === 'male') {
        yield reply({
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [{
                title: 'Geek',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Geek',
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'geek' }
                  })
                }]
              }, {
                title: 'Business',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Business',
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'business' }
                  })
                }]
              }, {
                title: 'Casual',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Casual',
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'casual' }
                  })
                }]
              }, {
                title: 'Créateur',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Créateur',
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'creator' }
                  })
                }]
              }, {
                title: 'Streetwear',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Streetwear',
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'streetwear' }
                  })
                }]
              }]
            }
          }
        })
      }

      if (context.gender === 'female') {
        yield reply({
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [{
                title: 'Geek',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Geek',
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'geek' }
                  })
                }]
              }, {
                title: 'Street',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Street',
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'street' }
                  })
                }]
              }, {
                title: 'Classic',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Classic',
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'classic' }
                  })
                }]
              }, {
                title: 'Luxe',
                subtitle: ``,
                image_url: 'http://storage-cube.quebecormedia.com/v1/dynamic_resize?quality=75&size=1500x1500&src=http%3A%2F%2Fstorage-cube.quebecormedia.com%2Fv1%2Fellequebec_prod%2Felle_quebec%2F1027d33e-ced8-430d-a558-256d439a899a%2Fpere-enfant.jpg',
                buttons: [{
                  type: 'postback',
                  title: 'Luxe',
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'luxury' }
                  })
                }]
              }]
            }
          }
        })
      }

      return Object.assign({}, context, {
        priceRange: Array.isArray(action.data.priceRange) ? action.data.priceRange : [0, action.data.priceRange],
        _expect: null
      })
    }

    case 'SELECT_STYLE': {
      yield reply({
        text: `Ok, je te propose les produits suivants.`
      })

      yield reply({
        text: `Si tu cliques sur "Accèder au produit", tu seras renvoyé directement sur la fiche produit de Menlook (car Facebook ne me permet pas encore de te faire payer directement ici).`
      })

      yield reply({
        text: `Si tu veux lancer une nouvelle recherche , il te suffit de taper "Recherche" ou de cliquer sur (picto menu persistant) puis "Nouvelle recherche" en bas à gauche de la conversation.`
      })

      const newContext = Object.assign({}, context, action.data, {
        page: 0
      })

      yield reply(yield listProducts(newContext))
      return newContext
    }

    case 'NEXT_PAGE': {
      const newContext = Object.assign({}, context, action.data, {
        page: context.page + 1
      })

      yield reply(yield listProducts(newContext))
      return newContext
    }

    case 'NOOP':
      return context

    case 'UNKNOWN':
    default:
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
})

function* listProducts (context) {
  const products = yield Product
    .find({
      $and: [{
        quantity: { $gt: 0 }
      }, {
        $or: [
          { gender: { $eq: context.gender } },
          { gender: { $eq: null } }
        ]
      }, {
        $or: [{
          age: {
            // Get closest age
            $eq: [25, 40, 60, 80].reduce((acc, age) => {
              return Math.abs(age - context.age) < Math.abs(acc - context.age) ? age : acc
            }, 0)
          }
        }, {
          age: { $eq: 0 }
        }]
      }, {
        style: {
          $eq: {
            geek: 'Geek',
            business: 'Business',
            casual: 'Casual',
            creator: 'Créateur',
            streetwear: 'Streetwear',
            street: 'Street',
            classic: 'Classic',
            luxury: 'Luxe'
          }[context.style]
        }
      // }, {
      //   price: {
      //     $gte: context.priceRange[0],
      //     $lte: context.priceRange[1]
      //   }
      }]
    })
    .skip((context.page || 0) * 4)
    .limit(4)
    .exec()

  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'list',
        elements: products.map(product => ({
          title: product.title,
          image_url: product.imageUrl,
          subtitle: `${parseFloat(product.price, 10).toFixed(2)} € - ${product.brand}`,
          default_action: {
            type: 'web_url',
            url: product.link.replace(/^http:/i, 'https:'),
            messenger_extensions: true,
            webview_height_ratio: 'tall'
          }
        })),
        buttons: [{
          type: 'postback',
          title: 'Voir plus',
          payload: JSON.stringify({
            type: 'NEXT_PAGE'
          })
        }]
      }
    }
  }
}
