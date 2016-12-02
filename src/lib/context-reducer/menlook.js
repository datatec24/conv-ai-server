const co = require('co')
const Product = require('../../models/product')

const random = (arr) => arr[Math.floor(Math.random() * arr.length)]

const shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

const confirm = () => random([
  `Yes, let's go`,
  `Oui, je confirme`,
  `Ok, je clique`,
  `Je valide`,
  `Ok, je continue`,
  `Oui c'est ça`
])

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

const defaultContext = {
  _expect: [{
    actionType: 'RESET',
    dataType: 'string',
    matches: [
      'reset',
      'est parti',
      'c parti',
      'nouvelle recherche',
      'recherche',
      'go'
    ]
  }, {
    actionType: 'GREETINGS',
    dataType: 'string',
    matches: [
      'salut',
      'bonjour',
      'hello',
      'ciao',
      'hey',
      'hi',
      'yo'
    ]
  }, {
    actionType: 'INSULT',
    dataType: 'string',
    matches: [
      'encule',
      'fils de pute',
      'ta gueule',
      'gueule',
      'pd',
      'ntm',
      'nique',
      'nike',
      'salaup',
      'salot',
      'race',
      'tg',
      'suce',
      'bite',
      'zeub',
      'va te faire'
    ]
  }, {
    actionType: 'THANKS',
    dataType: 'string',
    matches: [
      'merci',
      'thanks',
      'thank you'
    ]
  }, {
    actionType: 'COMPLIMENT',
    dataType: 'string',
    matches: [
      `cool`,
      `sympa`,
      `c'est bien`,
      `c'est sympa`,
      `trop cool`,
      `nice`,
      `stylé`
    ]
  }, {
    actionType: 'SECRET',
    dataType: 'string',
    matches: [
      'secret',
      'secrète',
      'secrets',
      'secrètes',
      'secre'
    ]
  }, {
    actionType: 'SELECT_MAIL',
    dataType: 'regex',
    dataKey: 'mail',
    regex: /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
  }]
}

module.exports = co.wrap(function* (messenger, user, context = defaultContext, action = { type: 'NOOP' }) {
  const reply = messenger.sendMessage.bind(messenger, user.messenger.id)
  const replyMany = messages => messages.reduce((p, m) => p.then(() => reply(m)), Promise.resolve())

  switch (action.type) {
    case 'START':{
      yield reply({
        text: `🎄 Bonjour ${user.profile.firstName}, je m'appelle Rudolph. 🎄`
      })

      yield delay(1000)

      yield reply({
        text: `Je peux t'aider à trouver les meilleurs cadeaux 🎁 de Noël pour tes proches ou te faire gagner des bons d'achat Menlook ;)`
      })

      yield reply({
        text: `Que souhaites-tu faire ?`
      })

      yield reply({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: `Trouver un cadeau 🎁`,
              image_url: 'http://www.yogamag.info/dir/wp-content/uploads/2014/12/liste-cadeaux-noel.jpg',
              buttons: [{
                type: 'postback',
                title: confirm(),
                payload: JSON.stringify({
                  type: 'START_PRESENT',
                })
              }]
            }, {
              title: 'Tenter de remporter des chèques cadeaux Menlook 💸',
              image_url: 'http://www.benrun.fr/image/data/Produits/chequecadeau.jpg',
              buttons: [{
                type: 'postback',
                title: confirm(),
                payload: JSON.stringify({
                  type: 'SECRET',
                })
              }]
            }, {
              title: 'Qui suis-je 🐑 ?',
              image_url: 'https://scontent-cdg2-1.xx.fbcdn.net/v/t1.0-9/15181156_361857034168686_3768989194421828295_n.jpg?oh=a489ff4bf01a6bf4d7edc8c28210956a&oe=58B498FF',
              buttons: [{
                type: 'postback',
                title: confirm(),
                payload: JSON.stringify({
                  type: 'PRESENTATION',
                })
              }]
            }]
          }
        }
      })


      return Object.assign({}, defaultContext, {
        secretFound: context.secretFound,
        mail: context.mail,
        registration: !context.registration ? new Date() : context.registration
      })
    }

    case 'RESET': {
      yield reply({
        text: `Que souhaites-tu faire ?`
      })

      yield reply({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: `Trouver un cadeau 🎁`,
              image_url: 'http://www.yogamag.info/dir/wp-content/uploads/2014/12/liste-cadeaux-noel.jpg',
              buttons: [{
                type: 'postback',
                title: confirm(),
                payload: JSON.stringify({
                  type: 'START_PRESENT',
                })
              }]
            }, {
              title: 'Tenter de remporter des chèques cadeaux Menlook 💸',
              image_url: 'http://www.benrun.fr/image/data/Produits/chequecadeau.jpg',
              buttons: [{
                type: 'postback',
                title: confirm(),
                payload: JSON.stringify({
                  type: 'SECRET',
                })
              }]
            }, {
              title: 'Qui suis-je 🐑 ?',
              image_url: 'https://scontent-cdg2-1.xx.fbcdn.net/v/t1.0-9/15181156_361857034168686_3768989194421828295_n.jpg?oh=a489ff4bf01a6bf4d7edc8c28210956a&oe=58B498FF',
              buttons: [{
                type: 'postback',
                title: confirm(),
                payload: JSON.stringify({
                  type: 'PRESENTATION',
                })
              }]
            }]
          }
        }
      })


      return Object.assign({}, defaultContext, {
        secretFound: context.secretFound,
        mail: context.mail,
        registration: !context.registration ? new Date() : context.registration
      })
    }

    case 'START_PRESENT': {
      yield reply({
        text: `Je vais te poser quelques questions afin de t'orienter vers les meilleurs cadeaux 🎁 de Noël 😉\nTu peux lancer une nouvelle recherche à tout moment en écrivant "Nouvelle recherche" sur ton clavier.`
      })

      yield delay(2000)

      yield reply({
        text: 'Á qui ce cadeau est-il destiné ? '
      })

      yield reply({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: `Une femme`,
              image_url: random([
                'https://media.giphy.com/media/Tmwir1pAi8fUk/giphy.gif',
                'https://media.giphy.com/media/10nHpaiNpVoHL2/giphy.gif',
                'https://media.giphy.com/media/WF7d2qsz6VuX6/giphy.gif',
                'https://media.giphy.com/media/CgqLPXCa9djMI/giphy.gif'
              ]),
              buttons: [{
                type: 'postback',
                title: confirm(),
                payload: JSON.stringify({
                  type: 'SELECT_GENDER',
                  data: { gender: 'female' }
                })
              }]
            }, {
              title: 'Un homme',
              image_url: random([
                'https://media.giphy.com/media/E9mB3gRCuIqeQ/giphy.gif',
                'https://media.giphy.com/media/pNpONEEg3pLIQ/giphy.gif',
                'https://media.giphy.com/media/iVRt7JRjBIH04/giphy.gif',
                'https://media.giphy.com/media/1vh1PXneQqN1e/giphy.gif'
              ]),
              buttons: [{
                type: 'postback',
                title: confirm(),
                payload: JSON.stringify({
                  type: 'SELECT_GENDER',
                  data: { gender: 'male' }
                })
              }]
            }]
          }
        }
      })
      return context
    }

    case 'PRESENTATION':{
      yield reply({
        text: `Moi c'est Rudolph, le renne de Menlook + METTRE UNE PHRASE SUR MENLOOK + HISTOIRE MARRANTE OU LIEN MENLOOK`
      })
      return context
    }

    case 'GREETINGS': {
      yield reply({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: `Bonjour ! Pour profiter de mes conseils, il te suffit de cliquer sur le bouton çi-dessous !`,
            buttons: [{
              type: 'postback',
              title: "C'est parti!",
              payload: JSON.stringify({ type: 'RESET' })
            }]
          }
        }
      })
      return context
    }

    case 'INSULT': {
      yield reply({
        text: random([
          `C'est plutôt facile de se lâcher sur un robot !`,
          `Tu oublies que je ne suis qu'un robot renne, cela ne me fait pas grand chose !`,
          `C'est pas gentil d'être méchant !`
        ])
      })

      yield reply({
        attachment: {
          type: 'image',
          payload: {
            url: random([
              'https://media.giphy.com/media/LYDNZAzOqrez6/giphy.gif',
              'https://media.giphy.com/media/Za3FFB6aXVAnS/giphy.gif',
              'https://media.giphy.com/media/a0Lgc1JvbfS4o/giphy.gif',
              'https://media.giphy.com/media/qV5IlxSm483vO/giphy.gif',
              'https://media.giphy.com/media/QghoJqOzVBu00/giphy.gif',
              'https://media.giphy.com/media/xT0GqgBS0IdI3rFXHy/giphy.gif',
              'https://media.giphy.com/media/JPHUCiioastGw/giphy.gif',
              'https://media.giphy.com/media/bKNmzXENcDU52/giphy.gif',
              'https://media.giphy.com/media/13myKxBVsLgmVG/giphy.gif',
              'https://media.giphy.com/media/AhwuGl0MPNzyg/giphy.gif'
            ])
          }
        }
      })

      return context
    }

    case 'THANKS': {
      yield reply({
        text: `Mais de rien, plaisir d'offrir joie de recevoir.`
      })

      yield reply({
        attachment: {
          type: 'image',
          payload: {
            url: random([
              'https://media.giphy.com/media/IcGkqdUmYLFGE/giphy.gif',
              'https://media.giphy.com/media/1Z02vuppxP1Pa/giphy.gif',
              'https://media.giphy.com/media/3ornjSL2sBcPflIDiU/giphy.gif',
              'http://giphy.com/gifs/bill-murray-N4vPkNL2Z3v3i'
            ])
          }
        }
      })

      yield reply({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: `N'hésites pas à rédemarrer une nouvelle recherche en cliquant sur le bouton ci-après`,
            buttons: [{
              type: 'postback',
              title: "C'est parti!",
              payload: JSON.stringify({ type: 'RESET' })
            }]
          }
        }
      })

      return context
    }

    case 'COMPLIMENT': {
      yield reply({
        text: random([
          `C'est très gentil de ta part !`,
          `À ton service ;)`
        ])
      })

      yield reply({
        attachment: {
          type: 'image',
          payload: {
            url: random([
              'https://media.giphy.com/media/l0HlSYBHR78sdHZDy/giphy.gif',
              'https://media.giphy.com/media/7SWwuV0toehfG/giphy.gif',
              'https://media.giphy.com/media/l3vRfiK5kaT1N5ZLy/giphy.gif',
              'https://media.giphy.com/media/RrVzUOXldFe8M/giphy.gif'
            ])
          }
        }
      })

      yield reply({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: `N'hésites pas à rédemarrer une nouvelle recherche en cliquant sur le bouton ci-après`,
            buttons: [{
              type: 'postback',
              title: "C'est parti!",
              payload: JSON.stringify({ type: 'RESET' })
            }]
          }
        }
      })

      return context
    }

    case 'SECRET': {
      if (context.secretFound && context.mail) {
        yield reply({
          text: `Tu as déjà trouvé le secret ! Tu sera prévenu à l'adresse suivante si tu es tiré au sort : ${context.mail}`
        })

        return context
      }

      yield reply({
        text: `Je vois que tu es dans les petits papiers !`
      })

      yield reply({
        text: `Esprit de Noël oblige, si tu trouves la réponse à cette question, tu pourras participer au tirage au sort qui te permettra peut-être de gagner un des trois bons d'achat de 100€ à dépenser sur Menlook...`
      })

      yield reply({
        text: ` Es-tu prêt ?`
      })

      yield reply({
        text: `Quel est le prix de l'article le plus cher que l'on peut trouver sur Menlook ?`
      })

      return Object.assign({}, context, {
        _expect: context._expect.concat({
          actionType: 'SELECT_SECRET',
          dataKey: 'secret',
          dataType: 'number'
        })
      })
    }

    case 'SELECT_SECRET': {
      if (action.data.secret === 65000) {
        if (context.mail) {
          yield reply({
            text: `Super ! Tu as vraiment de la chance ! Nous te contacterons à ${context.mail} le 20 décembre si tu fais parti des gagnants suite au tirage au sort !`
          })
        } else {
          yield reply({
            text: `Super ! Tu as vraiment de la chance ! Donne nous ton adresse e-mail et nous te contacterons le 20 décembre si tu fais parti des gagnants suite au tirage au sort !`
          })
        }

        return Object.assign({}, context, {
          secretFound: true,
          _expect: context._expect.filter(expectation => expectation.actionType !== 'SELECT_SECRET')
        })
      } else if (action.data.secret < 50000) {
        yield reply({
          text: `C'est encore bien trop bas ;)`
        })
      } else if (action.data.secret < 65000 && action.data.secret >= 50000) {
        yield reply({
          text: `Tu commences à t'approcher du compte! Mais tu est toujours un peu trop bas ;) `
        })
      } else if (action.data.secret > 65000 && action.data.secret <= 80000) {
        yield reply({
          text: `Tu te rapproches, mais tu es un peu trop haut ;) `
        })
      } else if (action.data.secret > 80000) {
        yield reply({
          text: `Tu es bien trop haut :) `
        })
      }

      return context
    }

    case 'CONFIRM_MAIL': {
      yield reply({
        text: `Ok, bien noté, je transmets :).`
      })

      yield reply({
        text: `Pourrais-tu qualifier l'expérience que tu as vécue avec une note de 1 à 5 (5 voulant dire que l'expérience et mes conseils t'ont plu)?`,
        quick_replies: [{
          content_type: 'text',
          title: '1',
          payload: JSON.stringify({
            type: 'NOTATION',
            data: {
              note: 1
            }
          })
        }, {
          content_type: 'text',
          title: '2',
          payload: JSON.stringify({
            type: 'NOTATION',
            data: {
              note: 2
            }
          })
        }, {
          content_type: 'text',
          title: '3',
          payload: JSON.stringify({
            type: 'NOTATION',
            data: {
              note: 3
            }
          })
        }, {
          content_type: 'text',
          title: '4',
          payload: JSON.stringify({
            type: 'NOTATION',
            data: {
              note: 4
            }
          })
        }, {
          content_type: 'text',
          title: '5',
          payload: JSON.stringify({
            type: 'NOTATION',
            data: {
              note: 5
            }
          })
        }]
      })

      return Object.assign({}, context, {
        mail: action.data.mail
      })
    }

    case 'OPPOSE_MAIL': {
      yield reply({
        text: `Peux-tu réessayer à nouveau s'il te plaît :)`
      })

      return context
    }

    case 'SELECT_MAIL': {
      yield reply({
        text: `J'ai compris que ton mail était: ${action.data.mail}\nTu confirmes?`,
        quick_replies: [{
          content_type: 'text',
          title: 'Oui',
          payload: JSON.stringify({
            type: 'CONFIRM_MAIL',
            data: {
              mail: action.data.mail
            }
          })
        }, {
          content_type: 'text',
          title: 'Non',
          payload: JSON.stringify({
            type: 'OPPOSE_MAIL'
          })
        }]
      })
      return context
    }

    case 'NOTATION': {
      yield reply({
        text: `Merci pour ton retour :). N'hésites pas à rédemarrer une nouvelle recherche en saisissant "C'est parti" et à parler de mes services autour de toi :).`
      })

      return Object.assign({}, context, {
        note: action.data.note
      })
    }

    case 'SELECT_GENDER': {
      if (action.data.gender === 'male') {
        yield reply({
          text: `Très bien ! Peux-tu me dire qui il est pour toi ?`
        })

        yield reply({
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [{
                title: 'Mon père',
                subtitle: `Homme qui a engendré ou qui a adopté un ou plusieurs enfants`,
                image_url: random([
                  'https://media.giphy.com/media/44b1ABtsG7VTy/giphy.gif',
                  'https://media.giphy.com/media/77JBBB0wIiFMc/giphy.gif',
                  'https://media.giphy.com/media/KP5J5Ss9moWaI/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'father' }
                  })
                }]
              }, {
                title: 'Mon frère',
                subtitle: `Personne de sexe masculin née du même père et de la même mère qu'une autre personne.`,
                image_url: random([
                  'https://media.com/media/l0HlKTVessi0K1HVK/giphy.gif',
                  'https://media.giphy.com/media/l3V0dclK0lcUw2ygE/giphy.gif',
                  'https://media.giphy.com/media/a8XDXwqpfK1JS/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'brother' }
                  })
                }]
              }, {
                title: 'Mon ami',
                subtitle: `Personne avec laquelle on est uni par l'amitié`,
                image_url: random([
                  'https://media.giphy.com/media/5mgDtUF43Y97q/giphy.gif',
                  'https://media.giphy.com/media/AumVVt40AvQL6/giphy.gif',
                  'https://media.giphy.com/media/o6cJXv8MbLMTS/giphy.gif',
                  'https://media.giphy.com/media/l41lM3jUUM2uilC4U/giphy.gif',
                  'https://media.giphy.com/media/fLK0eUlYZoB6E/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'friend_male' }
                  })
                }]
              }, {
                title: 'Mon amoureux',
                subtitle: `Personne qui partage ta vie amoureuse`,
                image_url: random([
                  'https://media.giphy.com/media/mOfjr4Xg9Vqxi/giphy.gif',
                  'https://media.giphy.com/media/TccrVZ64pi1Py/giphy.gif',
                  'https://media.giphy.com/media/KQ2n8S4dYd2SI/giphy.gif',
                  'https://media.giphy.com/media/BgvVzUbQdcWL6/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'husband' }
                  })
                }]
              }, {
                title: 'Un autre',
                subtitle: `Autre personne de sexe masculin`,
                image_url: random([
                  'https://media.giphy.com/media/xI5dVJKpKLzK8/giphy.gif',
                  'https://media.giphy.com/media/3o85xziIp4uruHAtB6/giphy.gif',
                  'https://media.giphy.com/media/cQhWrl1CrGD04/giphy.gif',
                  'https://media.giphy.com/media/glmRyiSI3v5E4/giphy.gif',
                  'https://media.giphy.com/media/GmdFiZtdJtQty/giphy.gif',
                  'https://media.giphy.com/media/3oz8xZvvOZRmKay4xy/giphy.gif',
                  'https://media.giphy.com/media/xxAjGUJC0Zfd6/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'other_male' }
                  })
                }]
              }]
            }
          }
        })
      }

      if (action.data.gender === 'female') {
        yield reply({
          text: `Parfait, nous avons une belle sélection pour elles ! Qui est l'heureuse élue ?`
        })

        yield reply({
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [{
                title: 'Mon amoureuse',
                subtitle: `Personne qui partage ta vie amoureuse`,
                image_url: random([
                  'https://media.giphy.com/media/vnFgpIPUm2LWE/giphy.gif',
                  'https://media.giphy.com/media/C22AQC8rmdm8w/giphy.gif',
                  'https://media.giphy.com/media/B0yZVxVLvvvnq/giphy.gif',
                  'https://media.giphy.com/media/FWEDryeIeESeA/giphy.gif',
                  'https://media.giphy.com/media/GPM6GakQaAnf2/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'wife' }
                  })
                }]
              }, {
                title: 'Ma mère',
                subtitle: `Femme qui a mis au monde ou qui a adopté un ou plusieurs enfants`,
                image_url: random([
                  'https://media.giphy.com/media/KJXClfNiq0vCM/giphy.gif',
                  'https://media.giphy.com/media/d2YXyTfgHz4bDO00/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'mother' }
                  })
                }]
              }, {
                title: 'Ma sœur',
                subtitle: `Personne de sexe féminin née du même père et de la même mère qu'une autre personne.`,
                image_url: random([
                  'https://media.giphy.com/media/3C1TYPFzBNrig/giphy.gif',
                  'https://media.giphy.com/media/13Xe6nce2ROdjO/giphy.gif',
                  'https://media.giphy.com/media/EGxcdWWhj3OrS/giphy.gif',
                  'https://media.giphy.com/media/OWNEvHukFpZAc/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'sister' }
                  })
                }]
              }, {
                title: 'Mon amie',
                subtitle: `Personne avec laquelle on est uni par l'amitié`,
                image_url: random([
                  'https://media.giphy.com/media/wjQQeYnTW4cCY/giphy.gif',
                  'https://media.giphy.com/media/10kFjmefxCQfmg/giphy.gif',
                  'https://media.giphy.com/media/xT0BKuPe7RolxPv2aQ/giphy.gif',
                  'https://media.giphy.com/media/ICHNzBhqrkgda/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'friend_female' }
                  })
                }]
              }, {
                title: 'Une autre',
                subtitle: `Autre personne de sexe féminin`,
                image_url: random([
                  'https://media.giphy.com/media/VxLkYEkjHviP6/giphy.gif',
                  'https://media.giphy.com/media/MjCgH2eZuBtcc/giphy.gif',
                  'https://media.giphy.com/media/3o6ZtctTqhjH5H7pv2/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_PERSON_TYPE',
                    data: { personType: 'other_female' }
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
          text: `Très bien, peux tu me donner son âge ?`
        })
      }

      if (action.data.personType === 'brother') {
        yield reply({
          text: `Aucun problème ! Peux-tu me donner son âge ?`
        })
      }

      if (action.data.personType === 'friend_male') {
        yield reply({
          text: `C'est très sympathique de ta part ! Peux-tu me donner son âge ? `
        })
      }

      if (action.data.personType === 'husband') {
        yield reply({
          text: `Parfait ! Peux-tu me donner l'âge de ton conjoint ?`
        })
      }

      if (action.data.personType === 'other_male') {
        yield reply({
          text: `Nous allons lui trouver de beaux cadeaux. Peux tu me donner son âge ?`
        })
      }

      if (action.data.personType === 'mother') {
        yield reply({
          text: `Elle sera très heureuse, j'en suis sûr ! Sans indiscrétion, peux-tu me donner son âge ?`
        })
      }

      if (action.data.personType === 'sister') {
        yield reply({
          text: `Très bien. Puis-je connaître l'âge de ta soeur ?`
        })
      }

      if (action.data.personType === 'friend_female') {
        yield reply({
          text: `Merci beaucoup ! Peux-tu me donner l'âge de cette amie ?`
        })
      }

      if (action.data.personType === 'wife') {
        yield reply({
          text: `Parfait, je vais faire de mon mieux alors ! Peux tu me donner son âge ?`
        })
      }

      if (action.data.personType === 'other_female') {
        yield reply({
          text: `Très bien ! Pourrais-tu me donner son âge s'il te plaît ?`
        })
      }

      return Object.assign({}, context, {
        _expect: context._expect.concat({
          actionType: 'SELECT_AGE',
          dataKey: 'age',
          dataType: 'number'
        })
      }, action.data)
    }

    case 'SELECT_AGE': {
      if (action.data.age < 10) {
        yield reply({
          text: `J'ai bien peur que cela soit un peu jeune pour moi ! Une visite chez Jouet Club s'impose !`
        })

        yield reply({
          attachment: {
            type: 'image',
            payload: {
              url: random([
                'https://media.giphy.com/media/pjnfNhaFmkhxu/giphy.gif',
                'https://media.giphy.com/media/l2RaPhzQeY4ODghNK/giphy.gif'
              ])
            }
          }
        })

        return context
      }

      if (action.data.age > 100) {
        yield reply({
          text: `C'est peut-être un peu vieux pour moi ! Ne voudrais-tu pas lui offrir des chocolats plutôt ?`
        })

        yield reply({
          attachment: {
            type: 'image',
            payload: {
              url: 'https://media.giphy.com/media/hn45V8hBhRIpW/giphy.gif'
            }
          }
        })

        return context
      }

      yield reply({
        text: `Parfait ! Puis-je connaître ton budget ?`,
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
        _expect: context._expect.concat({
          actionType: 'SELECT_PRICE_RANGE',
          dataKey: 'priceRange',
          dataType: 'number'
        }).filter(expectation => expectation.actionType !== 'SELECT_AGE')
      }, action.data)
    }

    case 'SELECT_PRICE_RANGE': {
      const priceRange = Array.isArray(action.data.priceRange) ? action.data.priceRange : [0, action.data.priceRange]
      const [, max] = priceRange

      if (max <= 50) {
        yield reply({
          text: `Je comprends, j'ai aussi une famille nombreuse !`
        })

        yield reply({
          attachment: {
            type: 'image',
            payload: {
              url: random([
                'https://media.giphy.com/media/ND6xkVPaj8tHO/giphy.gif',
                'https://media.giphy.com/media/l4KhOnDl9ObQxL1BK/giphy.gif'
              ])
            }
          }
        })
      } else if (max <= 100) {
        yield reply({
          text: `De quoi trouver un beau cadeau !`
        })

        yield reply({
          attachment: {
            type: 'image',
            payload: {
              url: random([
                'https://media.giphy.com/media/11ZAUfeJHojWlW/giphy.gif',
                'https://media.giphy.com/media/STUiEE2rjqy88/giphy.gif'
              ])
            }
          }
        })
      } else if (max <= 200) {
        yield reply({
          text: `Parfait, tu vas avoir l'embarras du choix ! `
        })

        yield reply({
          attachment: {
            type: 'image',
            payload: {
              url: random([
                'https://media.giphy.com/media/6nHevnTd8p6eI/giphy.gif',
                'https://media.giphy.com/media/gOnd03UWo6hG0/giphy.gif'
              ])
            }
          }
        })
      } else {
        yield reply({
          text: `Quelle chance ! C'est très gentil de ta part ! `
        })

        yield reply({
          attachment: {
            type: 'image',
            payload: {
              url: random([
                'https://media.giphy.com/media/2u11zpzwyMTy8/giphy.gif',
                'https://media.giphy.com/media/3osxYamKD88c6pXdfO/giphy.gif',
                'https://media.giphy.com/media/8OlT82jKm6Ugg/giphy.gif'
              ])
            }
          }
        })
      }

      yield reply({
        text: `Dernière question et je te fais des propositions, quel style a ${{
          father: 'ton père',
          brother: 'ton frère',
          friend_male: 'ton ami',
          other_male: 'cette personne',
          husband: 'ton amoureux',
          mother: 'ta mère',
          sister: 'ta sœur',
          friend_female: 'ton amie',
          wife: 'ton amoureuse',
          other_female: 'cette personne'
        }[context.personType]} ?`
      })

      if (context.gender === 'male') {
        yield reply({
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [{
                title: 'Casual',
                subtitle: `Si simplicité rime avec efficacité`,
                image_url: random([
                  'https://media.giphy.com/media/l3vRo0x0MQ15dtNvO/giphy.gif',
                  'https://media.giphy.com/media/wZwRL2iqmV5S0/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'casual' }
                  })
                }]
              }, {
                title: 'Business',
                subtitle: `Si il est capable de porter un costume, même en jardinant.`,
                image_url: random([
                  'https://media.giphy.com/media/geXJ0CoZr9PyM/giphy.gif',
                  'https://media.giphy.com/media/eu9wzTP9nrMHu/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'business' }
                  })
                }]
              }, {
                title: 'Créateur',
                subtitle: `La mode, la mode, la mode !`,
                image_url: random([
                  'https://media.giphy.com/media/12npFVlmZoXN4Y/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'creator' }
                  })
                }]
              }, {
                title: 'Streetwear',
                subtitle: `Si Chelsea est avant tout un club de Football et non une paire de boots`,
                image_url: random([
                  'https://media.giphy.com/media/MGEAxIetbbYIM/giphy.gif',
                  'https://media.giphy.com/media/ThL1SeU0MWc6I/giphy.gif',
                  'https://media.giphy.com/media/M8Oyl5kERXxv2/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'streetwear' }
                  })
                }]
              }, {
                title: 'Geek',
                subtitle: `Sous titre : Si son ordinateur est son meilleur ami`,
                image_url: random([
                  'https://media.giphy.com/media/3osxYlcLL9cE1uqEms/giphy.gif',
                  'https://media.giphy.com/media/lfA4pv18hwQGQ/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'geek' }
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
                title: 'Classique',
                subtitle: `Si simplicité rime avec efficacité`,
                image_url: random([
                  'https://media.giphy.com/media/qwULUwNPgj2Qo/giphy.gif',
                  'https://media.giphy.com/media/AyyPXf1JCDFp6/giphy.gif',
                  'https://media.giphy.com/media/K0QF5KNyEbPcA/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'classic' }
                  })
                }]
              }, {
                title: 'Luxe',
                subtitle: `Diamonds are the girls best friends`,
                image_url: random([
                  'https://media.giphy.com/media/5cCsgiWcBI3Fm/giphy.gif',
                  'https://media.giphy.com/media/11NyZoAHUafEHe/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'luxury' }
                  })
                }]
              }, {
                title: 'Streetwear',
                subtitle: `Jamais sans mes baskets`,
                image_url: random([
                  'https://media.giphy.com/media/giOrHKMWzCE6I/giphy.gif',
                  'https://media.giphy.com/media/3o6MbptiXgo6YBredG/giphy.gif',
                  'https://media.giphy.com/media/l2SpYD0XxCIXaEGGI/giphy.gif',
                  'https://media.giphy.com/media/KcskXXAir5TCE/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'streetwear' }
                  })
                }]
              }, {
                title: 'Geek',
                subtitle: `Si son ordinateur est son meilleur ami`,
                image_url: random([
                  'https://media.giphy.com/media/HyQYsK9VHtSy4/giphy.gif'
                ]),
                buttons: [{
                  type: 'postback',
                  title: confirm(),
                  payload: JSON.stringify({
                    type: 'SELECT_STYLE',
                    data: { style: 'geek' }
                  })
                }]
              }]
            }
          }
        })
      }

      return Object.assign({}, context, {
        priceRange,
        _expect: context._expect.filter(expectation => expectation.actionType !== 'SELECT_PRICE_RANGE')
      })
    }

    case 'SELECT_STYLE': {
      yield reply({
        text: `Voici les super cadeaux que j'ai dénichés pour toi ${user.profile.firstName}!Clique sur 'Voir plus' pour voir d'autres cadeaux :)`
      })

      context = Object.assign({}, context, action.data, {
        page: 0
      })

      yield Product
        .find({
          $and: [{
            quantity: { $gt: 0 }
          }, {
            $or: [
              { gender: { $eq: context.gender } },
              { gender: { $eq: null } }
            ]
          }, {
            $or: context.style === 'geek' ? [{
              age: { $gte: 0 }
            }] : [{
              age: {
                $eq: [25, 40, 60, 80].reverse().reduce((acc, age) => age >= context.age ? age : acc)
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
                classic: 'Classic',
                luxury: 'Luxe'
              }[context.style]
            }
          }, {
            price: context.style === 'geek' ? { $gte: 0 } : {
              $gte: context.priceRange[0] * 100,
              $lte: context.priceRange[1] * 100
            }
          }]
        })
        .exec()
        .then(function (data) {
          context.product_to_propose = shuffle(data)
          return data
        })

      yield replyMany(yield showProducts(context))

      if (context.product_to_propose.length) {
        setTimeout(() => co(function* () {
          yield reply({
            text: `J'espère que tu as apprécié cette sélection ! N'hésite pas à m'en demander une nouvelle en écrivant "C'est parti".`
          })
          if (!context.secretFound) {
            yield delay(5000)
            yield reply({
              attachment: {
                type: 'template',
                payload: {
                  template_type: 'button',
                  text: `Allez, je te fais moi aussi un cadeau. Menlook te propose de gagner 100€ en bon d'achats si tu découvres mon secret !!`,
                  buttons: [{
                    type: 'postback',
                    title: "Jouer",
                    payload: JSON.stringify({ type: 'SECRET' })
                  }]
                }
              }
            })
          }
        }), 40000)
      } else {
        setTimeout(() => co(function* () {
          if (!context.secretFound) {
            yield reply({
              attachment: {
                type: 'template',
                payload: {
                  template_type: 'button',
                  text: `Allez, je te fais moi aussi un cadeau. Menlook te propose de gagner 100€ en bon d'achats si tu découvres mon secret !!`,
                  buttons: [{
                    type: 'postback',
                    title: "Jouer",
                    payload: JSON.stringify({ type: 'SECRET' })
                  }]
                }
              }
            })
          }
        }), 5000)
      }
      return context
    }

    case 'NEXT_PAGE': {
      const newContext = Object.assign({}, context, action.data, {
        page: context.page + 1
      })

      yield replyMany(yield showProducts(newContext))

      return newContext
    }

    case 'NOOP':
      return context

    case 'UNKNOWN':
    default:
      yield reply({
        text:`Pardon je n'ai pas bien compris :( Pour être honnête avec toi, je ne suis qu'un robot avec un costume de renne. Peux-tu cliquer sur les choix que je t'ai présentés ou répondre à ce que je t'ai demandé? Merci :)`
      })

      return context
  }
})

// function* getProducts (context) {
//   return Product
//     .find({
//       $and: [{
//         quantity: { $gt: 0 }
//       }, {
//         $or: [
//           { gender: { $eq: context.gender } },
//           { gender: { $eq: null } }
//         ]
//       }, {
//         $or: context.style === 'geek' ? [{
//           age: { $gte: 0 }
//         }] : [{
//           age: {
//             $eq: [25, 40, 60, 80].reverse().reduce((acc, age) => age >= context.age ? age : acc)
//           }
//         }, {
//           age: { $eq: 0 }
//         }]
//       }, {
//         style: {
//           $eq: {
//             geek: 'Geek',
//             business: 'Business',
//             casual: 'Casual',
//             creator: 'Créateur',
//             streetwear: 'Streetwear',
//             classic: 'Classic',
//             luxury: 'Luxe'
//           }[context.style]
//         }
//       }, {
//         price: context.style === 'geek' ? { $gte: 0 } : {
//           $gte: context.priceRange[0] * 100,
//           $lte: context.priceRange[1] * 100
//         }
//       }]
//     })
//     .skip((context.page || 0) * 4)
//     .limit(4)
//     .exec()
// }

function* showProducts (context) {

  let products = context.product_to_propose.slice(context.page * 4 || 0, (context.page * 4 || 0) + 4)

  if (!products.length) {
    return [{
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: `Je suis vraiment désolé, je n'ai plus aucun produit à te proposer pour ces critères. Si tu veux bien me donner ton adresse mail, je la transmets à mes équipes qui t'enverront une proposition personnalisée. Sinon, tu peux effectuer une nouvelle recherche avec d'autres critères en saisissant "C'est parti"`,
          buttons: [{
            type: 'postback',
            title: "C'est parti!",
            payload: JSON.stringify({ type: 'RESET' })
          }]
        }
      }
    }]
  }

  if (products.length === 1) {
    return [{
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [{
            title: products[0].title,
            image_url: products[0].imageUrl,
            subtitle: `${(products[0].price / 100).toFixed(2)} € - ${products[0].brand}`,
            buttons: [{
              type: 'web_url',
              title: 'Acheter',
              url: products[0].link.replace(/^http:/i, 'https:'),
              messenger_extensions: false
            }]
          }]
        }
      }
    }]
  }

  return [{
    attachment: {
      type: 'template',
      payload: {
        template_type: 'list',
        'top_element_style': 'compact',
        elements: products.map(product => ({
          title: product.title,
          image_url: product.imageUrl,
          subtitle: `${(product.price / 100).toFixed(2)} € - ${product.brand}`,
          buttons: [{
            type: 'web_url',
            title: 'Acheter',
            url: product.link.replace(/^http:/i, 'https:'),
            messenger_extensions: false
          }]
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
  }]
}
