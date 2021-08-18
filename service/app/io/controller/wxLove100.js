'use strict'

const Controller = require('egg').Controller

class DefaultController extends Controller {
  async agree() {
    const { ctx, app } = this
    const message = ctx.args[0] || {}
    const nsp = app.io.of('/love100')
    if (app.love100SocketMap[message.userId]) {
      nsp.to(app.love100SocketMap[message.userId]).emit('agree', `Hi! I've agree`)
    }
  }
}

module.exports = DefaultController
