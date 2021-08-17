'use strict'

const Controller = require('egg').Controller

class DefaultController extends Controller {
  async index() {
    const { ctx, app } = this
    ctx.socket.emit('res', `Hi! I've got your message`)
  }
}

module.exports = DefaultController
