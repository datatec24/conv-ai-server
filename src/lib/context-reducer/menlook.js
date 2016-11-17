const co = require('co')
const Product = require('../../models/product')

const random = (arr) => arr[Math.floor(Math.random() * arr.length)]

const confirm = () => random([
  `Yes, let's go`,
  `Oui, je confirme`,
  `Ok, je clique`,
  `Je valide`,
  `Ok, je continue`,
  `Oui c'est ça`
])

const defaultContext = {
  _expect: [{
    actionType: 'RESET',
    dataType: 'string',
    matches: [
      'reset',
      'est parti',
      'c parti'
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
      `abruti`,
      `ahuri`,
      `aigrefin`,
      `anachorète`,
      `analphabète`,
      `andouille`,
      `anus de poulpe`,
      `arsouille`,
      `aspirateur a muscadet`,
      `assisté`,
      `asticot`,
      `attardé`,
      `avorton`,
      `babache`,
      `bachibouzouk`,
      `balai de chiottes`,
      `baltringue`,
      `banane`,
      `bandit`,
      `barjot`,
      `batârd`,
      `betterave`,
      `bigleux`,
      `blaireau`,
      `boloss`,
      `bordel`,
      `bordel à cul`,
      `boudin`,
      `bouffon`,
      `bougre d’âne`,
      `bougre d’imbécile`,
      `bougre de congre`,
      `bougre de conne`,
      `boule de pus`,
      `boulet`,
      `bouricot`,
      `bourique`,
      `bourrin`,
      `boursemolle`,
      `boursouflure`,
      `bouseux`,
      `boutonneux`,
      `branleur`,
      `branlotin`,
      `branque`,
      `branquignole`,
      `brigand`,
      `brêle`,
      `brosse à chiottes`,
      `bubon puant`,
      `burne`,
      `butor`,
      `bécasse`,
      `bégueule`,
      `bélitre`,
      `béotien`,
      `bête`,
      `cageot`,
      `cagole`,
      `calice`,
      `canaille`,
      `canaillou`,
      `cancrelat`,
      `caprinophile`,
      `carburateur à beaujolais`,
      `caribou`,
      `casse-pieds`,
      `cassos (cas social)`,
      `catin`,
      `cave`,
      `cervelle d’huitre`,
      `chacal`,
      `chacal puant`,
      `chafouin,`,
      `chameau`,
      `chancreux`,
      `chancre puant`,
      `chaoui`,
      `charogne`,
      `chenapan`,
      `chiassard`,
      `chiasse de caca fondu`,
      `chieur`,
      `chiure de pigeon`,
      `cinglé`,
      `clampin`,
      `cloaque`,
      `cloche`,
      `clodo`,
      `cloporte`,
      `clown`,
      `cochon`,
      `cocu`,
      `con`,
      `conard`,
      `conchieur`,
      `concombre`,
      `connard`,
      `connasse`,
      `conne`,
      `coprolithe`,
      `coprophage`,
      `cornard`,
      `cornegidouille`,
      `corniaud`,
      `cornichon`,
      `couard`,
      `couille de tétard`,
      `couille molle`,
      `couillon`,
      `crapaud de pissotière`,
      `crapule`,
      `crassard`,
      `crasseuse`,
      `crasspouillard!`,
      `crevard`,
      `crevure`,
      `crotte de moineau`,
      `cryptorchide`,
      `crâne d’obus`,
      `crétin`,
      `crétin des alpes`,
      `crétin des iles`,
      `crétin goîtreux`,
      `cuistre`,
      `cul de babouin`,
      `cul terreux`,
      `dégueulasse`,
      `don juan de pissotière`,
      `ducon`,
      `dugenou`,
      `dugland`,
      `dypterosodomite`,
      `débile`,
      `décamerde`,
      `décérébré`,
      `dégueulis`,
      `dégénéré chromozomique`,
      `dégénéré du bulbe`,
      `dépravé`,
      `détritus`,
      `ecervelé`,
      `ectoplasme`,
      `emmerdeur`,
      `empaffé`,
      `emplâtre`,
      `empoté`,
      `enculeur de mouches`,
      `enculé`,
      `enflure`,
      `enfoiré`,
      `erreur de la nature`,
      `eunuque`,
      `face de cul`,
      `face de pet`,
      `face de rat`,
      `faquin`,
      `faraud`,
      `faux jeton`,
      `fesse d’huitre`,
      `fesse de moule`,
      `fesses molles`,
      `fiente`,
      `filou`,
      `fini à l’urine`,
      `fion`,
      `fiote`,
      `flaque de pus`,
      `foireux`,
      `foldingue`,
      `fonctionnaire`,
      `fouille merde`,
      `four à merde`,
      `fourbe`,
      `foutriquet`,
      `frapadingue`,
      `frappe`,
      `freluquet`,
      `fricoteur`,
      `frigide`,
      `fripouille`,
      `frippon`,
      `frustré`,
      `fumier`,
      `fumiste`,
      `furoncle`,
      `félon`,
      `ganache`,
      `gangrène`,
      `garage a bite`,
      `gibier de potence`,
      `gland`,
      `glandeur`,
      `glandus`,
      `globicéphale`,
      `gnome`,
      `godiche`,
      `gogol`,
      `goinfre`,
      `gommeux`,
      `gougnafier`,
      `goujat`,
      `goulu`,
      `gourdasse`,
      `gourgandin/e`,
      `grand cornichon`,
      `grand dépandeur d’andouilles`,
      `gras du bide`,
      `graveleux`,
      `gredin`,
      `grenouille`,
      `gringalet`,
      `grognasse`,
      `gros caca poilu`,
      `gros con`,
      `gros lard`,
      `grosse merde puante`,
      `grosse truie violette`,
      `grue`,
      `gueulard`,
      `gueule de fion`,
      `gueule de raie`,
      `gueux`,
      `gugus`,
      `guignol`,
      `has-been`,
      `hérétique`,
      `histrion`,
      `homoncule`,
      `hostie d’épais`,
      `hurluberlu`,
      `hérétique`,
      `iconoclaste`,
      `idiot`,
      `ignare`,
      `illettré`,
      `imbibé`,
      `imbécile`,
      `impuissant`,
      `infâme raie de cul`,
      `ironie de la création`,
      `ivrogne`,
      `jaune`,
      `jean-foutre`,
      `jobard`,
      `jobastre`,
      `judas`,
      `kroumir`,
      `kéké`,
      `laideron`,
      `larve`,
      `lavedu`,
      `lépreux`,
      `loboto`,
      `loutre analphabète`,
      `lèche-cul`,
      `malandrin`,
      `malotru`,
      `malpropre`,
      `manant`,
      `manche à couille`,
      `mange merde`,
      `maquereau`,
      `maquerelle`,
      `maraud`,
      `marchand de tapis`,
      `margoulin`,
      `merdaillon`,
      `merdasse`,
      `merde`,
      `merde molle`,
      `merdophile`,
      `merlan frit`,
      `microcéphale`,
      `minable`,
      `minus`,
      `miteux`,
      `moins que rien`,
      `molasson`,
      `mongol`,
      `mononeuronal`,
      `mont de brin`,
      `morbleu`,
      `morfale`,
      `morille`,
      `morpion`,
      `mortecouille`,
      `morue`,
      `morveux`,
      `motherfucker`,
      `mou du bulbe`,
      `mou du genou`,
      `mou du gland`,
      `moudlabite`,
      `moule à gauffre`,
      `mouton de panurge`,
      `méchant.`,
      `mécréant`,
      `mérule`,
      `nabot`,
      `nain de jardin`,
      `nanar`,
      `naze`,
      `nazillon`,
      `necropédophile`,
      `neuneu`,
      `nez de boeuf`,
      `niais, niaiseux`,
      `nigaud`,
      `niguedouille`,
      `noob`,
      `nounouille`,
      `nécrophile`,
      `obsédé`,
      `oiseau de mauvaise augure`,
      `olibrius`,
      `ordure purulente`,
      `outre à pisse`,
      `outrecuidant`,
      `pachyderme`,
      `paltoquet`,
      `panaris`,
      `parasite`,
      `parbleu`,
      `parvenu`,
      `patate`,
      `paumé`,
      `pauvre con`,
      `paysan`,
      `peau de bite`,
      `peau de vache`,
      `pecore`,
      `peigne-cul`,
      `peine a jouir`,
      `peine à jouir`,
      `pendard`,
      `pervers`,
      `pet de moule`,
      `petite merde`,
      `petzouille`,
      `phlegmon`,
      `pigeon`,
      `pignolo`,
      `pignouf`,
      `pimbêche`,
      `pinailleur`,
      `pine d’ours`,
      `pine d’huitre`,
      `pintade`,
      `pipistrelle puante`,
      `piqueniquedouille`,
      `pisse froid`,
      `pisse-vinaigre`,
      `pisseuse`,
      `pissure`,
      `piètre`,
      `planqué`,
      `playboy de superette`,
      `pleutre`,
      `plouc`,
      `poire`,
      `poireau`,
      `poivrot`,
      `polisson`,
      `poltron`,
      `pompe a merde`,
      `porc`,
      `pot de chambre`,
      `pouacre, pouacreux`,
      `pouffe`,
      `pouffiasse`,
      `poufieux`,
      `pouilleux`,
      `pourceau`,
      `pourriture`,
      `pousse mégot`,
      `punaise`,
      `putassière`,
      `pute au rabais`,
      `pute borgne`,
      `putréfaction`,
      `pygocéphale`,
      `pécore`,
      `pédale`,
      `péquenot`,
      `pétasse`,
      `pétassoïde conassiforme`,
      `pétochard`,
      `quadrizomique`,
      `queutard`,
      `quiche`,
      `raclure de bidet`,
      `raclure de chiotte`,
      `radasse`,
      `radin`,
      `ramassis de chiure de moineau`,
      `rambo de pacotille`,
      `rastaquouère`,
      `renégat`,
      `roquet`,
      `roublard`,
      `rouge`,
      `roulure`,
      `résidu de fausse couche`,
      `résidus de partouze`,
      `sabraque`,
      `sac à brin`,
      `sac à foutre`,
      `sac à gnole`,
      `sac à merde`,
      `sac à viande`,
      `sac à vin`,
      `sacrebleu`,
      `sacrement`,
      `sacripan`,
      `sagouin`,
      `salaud`,
      `saleté`,
      `saligaud`,
      `salopard`,
      `salope`,
      `saloperie`,
      `salopiaud`,
      `saltinbanque`,
      `saperlipopette`,
      `saperlotte`,
      `sauvage`,
      `scaphandrier d’eau de vaiselle`,
      `scatophile`,
      `scelerat`,
      `schnock`,
      `schpountz`,
      `serpillière à foutre`,
      `sinistrose ambulante`,
      `sinoque`,
      `sodomite`,
      `sombre conne`,
      `sombre crétin`,
      `sot`,
      `souillon`,
      `sous merde`,
      `spermatozoide avarié`,
      `spermiducte`,
      `suintance`,
      `sybarite`,
      `syphonné`,
      `tabarnak`,
      `tabernacle`,
      `tâcheron`,
      `tafiole`,
      `tanche`,
      `tartignole`,
      `taré`,
      `tas de saindoux`,
      `tasse à foutre`,
      `thon`,
      `tire couilles`,
      `tocard`,
      `tonnerre de brest`,
      `toqué`,
      `trainé`,
      `traîne savate`,
      `tricard`,
      `triple buse`,
      `tromblon`,
      `tronche de cake`,
      `trou de balle`,
      `trou du cul`,
      `troubignole`,
      `truand`,
      `trumeaux`,
      `tuberculeux`,
      `tudieu`,
      `tétârd`,
      `tête d’ampoule`,
      `tête de bite`,
      `tête de chibre`,
      `tête de con`,
      `tête de noeud`,
      `tête à claques`,
      `usurpateur`,
      `va nu pieds`,
      `va te faire`,
      `vandale`,
      `vaurien`,
      `vautour`,
      `ventrebleu`,
      `vermine`,
      `veule`,
      `vicelard`,
      `vieille baderne`,
      `vieille poule`,
      `vieille taupe`,
      `vieux chnoque`,
      `vieux con`,
      `vieux fossile`,
      `vieux tableau`,
      `vieux tromblon`,
      `vilain`,
      `vilain comme une couvée de singe`,
      `vioque`,
      `vipère lubrique`,
      `voleur`,
      `vorace`,
      `voyou`,
      `vérole`,
      `wisigoth`,
      `yéti baveux`,
      `zigomar`,
      `zigoto`,
      `zonard`,
      `zouave`,
      `zoulou`,
      `zozo`
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
      'secret'
    ]
  }, {
    actionType: 'SELECT_MAIL',
    dataKey: 'mail',
    dataType: 'string',
    matches: ['@']
  }]
}

module.exports = co.wrap(function* (messenger, user, context = defaultContext, action = { type: 'NOOP' }) {
  const reply = messenger.sendMessage.bind(messenger, user.messenger.id)
  const replyMany = messages => messages.reduce((p, m) => p.then(() => reply(m)), Promise.resolve())

  switch (action.type) {
    case 'START':
    case 'RESET': {
      yield reply({
        text: `Hello ${user.profile.firstName}, je m'appelle Mr Bot.`
      })

      yield reply({
        text: `Tu serais pas en galère de cadeau de noël par hasard ? Parce que si c'est le cas, tu as frappé à la bonne porte !`
      })

      yield reply({
        text: `Alors par contre je ne suis qu'un renne : autant dans ma famille on se transmet de père en fils la culture du cadeau, autant taper sur un clavier avec des sabots c'est un peu la galère, alors essayes de rester clair !`
      })

      yield reply({
        text: `Tu peux lancer une nouvelle recherche à tout moment en écrivant "C'est parti".`
      })

      yield reply({
        text: 'Il est pour qui ce cadeau ?'
      })

      yield reply({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: `Une femme`,
              subtitle: `C'est un humain mais pas un homme`,
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
              subtitle: `C'est un humain mais pas une femme`,
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

      return Object.assign({}, defaultContext, {
        secretFound: context.secretFound,
        mail: context.mail
      })
    }

    case 'GREETINGS': {
      yield reply({
        text: `Salut !`
      })
      return context
    }

    case 'INSULT': {
      yield reply({
        text: random([
          `Je sens que ça te fait du bien ! lache toi !`,
          `Haha tu oublies que je ne suis qu'un robot renne et que ça me passe bien au dessus des bois !`,
          `Oulà, c'est vraimant pas gentil d'être méchant`
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
            url: 'TODO'
          }
        }
      })

      return context
    }

    case 'COMPLIMENT': {
      yield reply({
        text: random([
          `Je sais je sais, c'est ça d'avoir les bois lustrés ;)`,
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
        text: `Ahh ! Je vois que t'es dans les petits papiers !`
      })

      yield reply({
        text: `Esprit de Noël oblige, si tu trouves la réponse à la question suivante, tu pourras participer au tirage au sort qui te permettra peut-être de gagner un des trois bons d'achat de 100€ à dépenser sur Menlook.`
      })

      yield reply({
        text: `T'es prêt ?`
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
            text: `T'as vraiment de la chance ! Nous te contacterons à l'adresse suivante le 20 décembre si tu fais parti des gagnants suite au tirage au sort ! ${context.mail}`
          })
        } else {
          yield reply({
            text: `T'as vraiment de la chance ! Donnes nous ton adresse e-mail et nous te contacterons le 20 décembre si tu fais parti des gagnants suite au tirage au sort !`
          })
        }

        return Object.assign({}, context, {
          secretFound: true,
          _expect: context._expect.filter(expectation => expectation.actionType !== 'SELECT_SECRET')
        })
      }

      yield reply({
        text: `Pas de chance ! Rien ne t'empêche de réessayer, mais j'ai bien peur que tu sois loin du compte !`
      })

      return context
    }

    case 'SELECT_MAIL': {
      yield reply({
        text: `Ok, bien noté, je transmets :). N'hésites pas à me demander une nouvelle selection en saisissant "C'est parti" et à parler de mes services autour de toi :).`
      })

      return Object.assign({}, context, {
        mail: action.data.mail
      })
    }

    case 'SELECT_GENDER': {
      if (action.data.gender === 'male') {
        yield reply({
          text: `Cool c'est ma spécialité ! Et cet homme, c'est qui pour toi ?`
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
                  'https://media.giphy.com/media/US08vOBGfQJsQ/giphy.gif',
                  'https://media.giphy.com/media/9b5oNUMROaHtu/giphy.gif'
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
                title: 'Mon pote',
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
                title: 'Mon mec',
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
          text: `Ca tombe bien ! On a aussi une belle sélection pour elles ;) Qui est l'heureuse élue ?`
        })

        yield reply({
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [{
                title: 'Ma mère',
                subtitle: `Femme qui a mis au monde ou qui a adopté un ou plusieurs enfants`,
                image_url: random([
                  'https://media.giphy.com/media/KJXClfNiq0vCM/giphy.gif',
                  'https://media.giphy.com/media/d2YXyTfgHz4bDO00/giphy.gif',
                  'https://media.giphy.com/media/3oEduZtPOv5OSecubu/giphy.gif'
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
                title: 'Ma pote',
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
          text: `Ah ouais le paternel il faut pas se planter ;). Désolé de l'indiscretion, mais peux-tu me dire quelle âge il a ?`
        })
      }

      if (action.data.personType === 'brother') {
        yield reply({
          text: `Un bon cadeau pour son frangin ! On va trouver à coup sur :). Il a quel âge du coup ?`
        })
      }

      if (action.data.personType === 'friend_male') {
        yield reply({
          text: `J'aimerais bien avoir des amis comme toi :). Il a quel âge ce pote ?`
        })
      }

      if (action.data.personType === 'husband') {
        yield reply({
          text: `Ok, on va se concentrer pour trouver quelque chose de bien alors :). Il a quel âge ton mec ?`
        })
      }

      if (action.data.personType === 'other_male') {
        yield reply({
          text: `Ca marche ;). Tu peux me dire quel âge il a ?`
        })
      }

      if (action.data.personType === 'mother') {
        yield reply({
          text: `Oula, j'ai beaucoup de poids sur les épaules :). Sans indiscretion, elle a quel âge ta mère ?`
        })
      }

      if (action.data.personType === 'sister') {
        yield reply({
          text: `Un bon cadeau pour sa frangine ! On devrait pouvoir s'en sortir :). Elle a quel age du coup ?`
        })
      }

      if (action.data.personType === 'friend_female') {
        yield reply({
          text: `J'aimerais bien avoir des amis comme toi :). Elle a quel age cette pote ?`
        })
      }

      if (action.data.personType === 'wife') {
        yield reply({
          text: `Ok, on va se concentrer pour trouver quelque chose de bien alors :). elle a quel âge ton amoureuse ?`
        })
      }

      if (action.data.personType === 'other_female') {
        yield reply({
          text: `Ca marche ;). Tu peux me dire quel âge elle a ?`
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
          text: `Aie aie aie, c'est trop jeune pour moi ça. Tu devrais aller voir chez jouet club :).`
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
          text: `Oula c'est vieux ! Offres lui plutôt des chocolats, s'il y a bien un âge ou on s'en fout de grossir...`
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
        text: `Parfait ! Et tu veux mettre combien ?`,
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
          text: `Je comprends, nous aussi on a une famille nombreuse`
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
          text: `Top, on va avoir l'embarras du choix`
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
          text: `T'aurais pas des choses à te faire pardonner ?`
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
          text: `C'est beau, cette année tu craques ton PEL !`
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
          friend_male: 'ton pote',
          other_male: 'cette personne',
          husband: 'ton mec',
          mother: 'ta mère',
          sister: 'ta sœur',
          friend_female: 'ta pote',
          wife: 'ta conjointe',
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
                title: 'Geek',
                subtitle: `Si son ordi est son meilleur ami`,
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
              }, {
                title: 'Business',
                subtitle: `Si même quand il bricole, il est capable d'être en costume`,
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
                title: 'Casual',
                subtitle: `Si le mieux est l'ennemi du bien`,
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
                title: 'Créateur',
                subtitle: `La mode, la mode, la mode`,
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
                subtitle: `Si Chelsea est plus un club de foot qu'une paire de boots`,
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
                subtitle: `Si son ordi est son meilleur ami`,
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
              }, {
                title: 'Street',
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
                    data: { style: 'street' }
                  })
                }]
              }, {
                title: 'Classic',
                subtitle: `Si le mieux est l'ennemi du bien`,
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
                subtitle: `Si elle préfère les carats aux carottes`,
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
        text: `Ok, je te propose les produits suivants. Si tu cliques sur "Acheter", tu seras renvoyé directement sur la fiche du produit sur Menlook.com.`
      })

      const newContext = Object.assign({}, context, action.data, {
        page: 0
      })

      const products = yield getProducts(newContext)

      yield replyMany(yield showProducts(yield getProducts(newContext)))

      if (products.length) {
        setTimeout(() => co(function* () {
          yield reply({
            text: `J'espère que tu as aimé la sélection que nous t'avons proposé ! Vas-y donnes moi ton adresse mail, comme ça je pourrai t'envoyer des sélections aux petits oignons ;).`
          })
        }), 3000)
      }

      return newContext
    }

    case 'NEXT_PAGE': {
      const newContext = Object.assign({}, context, action.data, {
        page: context.page + 1
      })

      yield replyMany(yield showProducts(yield getProducts(newContext)))
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
            text: `Oula, je crois que tu m'as démasqué... je préfère qu'on suive le déroulé parce que sinon je suis vite perdu : je vais être honnête avec toi, je ne suis qu'un robot avec un costume de renne. Si tu veux repartir à zéro clique sur le bouton qui apparait. Merci de ta compréhension.`,
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

function* getProducts (context) {
  return Product
    .find({
      $and: [{
        quantity: { $gt: 0 }
      }, {
        $or: [
          { gender: { $eq: context.gender } },
          { gender: { $eq: null } }
        ]
      }, {
        $or: [context.style === 'geek' ? null : {
          age: {
            $eq: [25, 40, 60, 80].reverse().reduce((acc, age) => age >= context.age ? age : acc)
          }
        }, {
          age: { $eq: 0 }
        }].filter(f => !!f)
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
      }, {
        price: {
          $gte: context.priceRange[0] * 100,
          $lte: context.priceRange[1] * 100
        }
      }]
    })
    .skip((context.page || 0) * 4)
    .limit(4)
    .exec()
}

function* showProducts (products) {
  if (!products.length) {
    return [{
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: `Je suis vraiment désolé, je n'ai plus aucun produit à te proposer. Si tu veux bien me donner ton adresse mail, je la transmets à mes équipes qui t'enverront une proposition personnalisée. Sinon, tu peux effectuer une nouvelle recherche avec d'autres critères en saisissant "C'est parti"`,
          buttons: [{
            type: 'postback',
            title: 'Réinitilaiser',
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
    }, {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: `C'est tout ce que j'ai à te proposer. Si tu veux réinitialiser la conversation clique sur le bouton ci-apres. Merci de ta compréhension.`,
          buttons: [{
            type: 'postback',
            title: 'Réinitilaiser',
            payload: JSON.stringify({ type: 'RESET' })
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
