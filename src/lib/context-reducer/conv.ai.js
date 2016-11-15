const { wrap } = require('co')

const defaultContext = {
  _expect: [{
    actionType: 'GREETINGS',
    dataType: 'string',
    matches: [
      'hello',
      'salut',
      'bonjour'
    ]
  }]
}

module.exports = wrap(function* (messenger, user, context = defaultContext, action = { type: 'NOOP' }) {
  const reply = messenger.sendMessage.bind(messenger, user.messenger.id)

  switch (action.type) {
    case 'GREETINGS':
      yield reply({
        text: 'Bonjour 🙂'
      })

      return Object.assign({}, context)

    case 'NOOP':
    default:
      return context
  }
})
