'use strict'
const shortid = require('shortid')

const Controller = require('egg').Controller

class HomeController extends Controller {
  async getPatam() {
    const { ctx, app } = this
    try {
      const result = await app.mysql.query(`SELECT * FROM love_param`)
      ctx.body = result[0]
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = HomeController
