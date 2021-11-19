'use strict'

const admin = require('./router/admin')
const importToMysql = require('./router/import')
const wxName = require('./router/wxName')
const wxLove = require('./router/wxLove')
const wxLove100 = require('./router/wxLove100')
const user = require('./router/user')
const musicComment = require('./router/musicComment')
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, io } = app

  admin(router, controller)
  user(router, controller)
  wxName(router, controller)
  wxLove(router, controller)
  wxLove100(router, controller, io)
  musicComment(router, controller)
  // importToMysql(router, controller);
}
