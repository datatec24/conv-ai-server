const messenger = require('../../services/messenger')

module.exports = router => {
  router.get('*', messenger.middleware())
}
