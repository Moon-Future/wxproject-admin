'use strict';
const jwt = require('jsonwebtoken')
const { checkToken } = require('../../utils/index')
const { tokenConfig } = require('../../../config/secret')

const Controller = require('egg').Controller;


class HomeController extends Controller {
  async login() {
    const { ctx, app } = this
    try {
      const { username, password } = ctx.request.body
      const result = await app.mysql.query(`SELECT * FROM user WHERE username = ? AND password = ?`, [username, password])
      if (result.length === 0) {
        ctx.status = 400
        ctx.body = { message: '用户名或密码有误' }
        return
      }
      const userInfo = result[0]
      delete userInfo.password
      const token = jwt.sign({ id: userInfo.id, username: userInfo.username }, tokenConfig.privateKey, {
        expiresIn: '7d'
      })
      ctx.body = { token: 'Bearer ' + token, userInfo }
    } catch (err) {
      throw new Error(err)
    }
  }

  async checkLogin() {
    const { ctx } = this
    const userInfo = checkToken(ctx)
    if (!userInfo) {
      ctx.status = 401
      ctx.body = {}
      return
    }
    ctx.body = {}
  }
}

module.exports = HomeController;
