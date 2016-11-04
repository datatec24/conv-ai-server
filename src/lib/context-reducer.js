const { wrap } = require('co')

module.exports = wrap(function* (context = {}, action = { type: 'NOOP' }) {
  switch (action.type) {
    case 'MERGE':
      return Object.assign({}, context, action.data)

    case 'RESET':
      return {}

    case 'NOOP':
    default:
      return context
  }
})

