const messenger = require('../../services/messenger')

module.exports = router => {
  router.use('*', messenger.middleware())
}
