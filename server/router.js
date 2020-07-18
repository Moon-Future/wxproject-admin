const Router = require('koa-router')
const user = require('./api/user')
const proname = require('./api/proName')
const lottery = require('./api/lottery')
const router = new Router({
  prefix: '/api'
})

router.use('/user', user.routes())
router.use('/proname', proname.routes())
router.use('/lottery', lottery.routes())

module.exports = router
