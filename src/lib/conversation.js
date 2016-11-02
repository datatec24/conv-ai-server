const R = require('ramda')
const co = require('co')

/**
 * Bot config, this should end up in bot object
 */

const personTypes = [{
  title: 'Mon père',
  action: {
    type: 'MERGE',
    data: {
      personType: 'father'
    }
  }
}, {
  title: 'Mon conjoint',
  action: {
    type: 'MERGE',
    data: {
      personType: 'partner'
    }
  }
}, {
  title: 'Un ami',
  action: {
    type: 'MERGE',
    data: {
      personType: 'friend'
    }
  }
}]

const priceRanges = [{
  title: '- de 50€',
  action: {
    type: 'MERGE',
    data: {
      priceRange: [0, 50]
    }
  }
}, {
  title: '50-100€',
  action: {
    type: 'MERGE',
    data: {
      priceRange: [50, 100]
    }
  }
}, {
  title: 'No limit',
  action: {
    type: 'MERGE',
    data: {
      // JSON doesn't accept Infinity
      priceRange: [0, Number.MAX_SAFE_INTEGER]
    }
  }
}]

const ageRanges = [{
  title: '25-40',
  action: {
    type: 'MERGE',
    data: {
      ageRange: [25, 40]
    }
  }
}, {
  title: '40-60',
  action: {
    type: 'MERGE',
    data: {
      ageRange: [40, 60]
    }
  }
}, {
  title: '60-80',
  action: {
    type: 'MERGE',
    data: {
      ageRange: [60, 80]
    }
  }
}]

const styles = [{
  title: 'Geek',
  action: {
    type: 'MERGE',
    data: {
      style: 'geek'
    }
  }
}, {
  title: 'Business',
  action: {
    type: 'MERGE',
    data: {
      style: 'business'
    }
  }
}, {
  title: 'Streetwear',
  action: {
    type: 'MERGE',
    data: {
      style: 'streetwear'
    }
  }
}]

const translate = R.curry((context, key) => {
  const value = context[key]

  switch (key) {
    case 'personType': {
      return {
        father: 'père',
        partner: 'partenaire',
        friend: 'ami'
      }[value]
    }

    case 'priceRange': {
      const [min, max] = value

      if (max === Number.MAX_SAFE_INTEGER) return 'sans limite de prix'
      if (min === 0) return `moins de ${max}€`
      return `entre ${min} et ${max}€`
    }

    case 'ageRange': {
      const [min, max] = value
      return `entre ${min} et ${max} ans`
    }

    case 'style': {
      return {
        geek: 'geek',
        business: 'business',
        streetwear: 'streetwear'
      }[value]
    }
  }
})

module.exports = R.curry((bot, context) => co(function* () {
  const {
    personType,
    priceRange,
    ageRange,
    style
  } = context

  const t = translate(context)

  switch (true) {
    case !personType:
      return createButtons('À qui souhaitez vous offrir un cadeau ?', personTypes)

    case !priceRange:
      return createButtons('Quel est votre budget ?', priceRanges)

    case !ageRange:
      return createButtons(`Dans quelle tranche d'âge se situe votre ${t('personType')} ?`, ageRanges)

    case !style:
      return createButtons('Quel style lui convient le mieux ?', styles)
  }

  return { text: `Ok, je recherche des cadeaux pour votre ${t('personType')}, ${t('priceRange')}, dans un style ${t('style')}` }
}))

/**
 * Utility function to generate buttons message
 */

function createButtons (text, buttons) {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [{
          title: text,
          buttons: buttons.map(button => ({
            type: 'postback',
            title: button.title,
            payload: JSON.stringify(button.action)
          }))
        }]
      }
    }
  }
}
