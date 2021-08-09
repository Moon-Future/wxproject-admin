'use strict'
const shortid = require('shortid')
const Controller = require('egg').Controller

class HomeController extends Controller {
  async getCardList() {
    const { ctx, app } = this
    try {
      const result = await app.mysql.query(`SELECT * FROM love100_card WHERE verify = ? AND off = ?`, [1, 0])
      ctx.body = { status: 1, data: result }
    } catch(e) {
      ctx.body = { message: '服务端出错' }
    }
  }

  async finished() {
    const { ctx, app } = this
    try {
      const { cardId, common, adr, date } = ctx.request.body
      await app.mysql.query(`INSERT INTO love100_finished (id, common, adr, date, cardId, off) VALUES (?, ?, ?, ?, ?, 0)`,
        [shortid(), common, adr, date, cardId])
      ctx.body = { status: 1 }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async cardFinished() {
    const { ctx, app } = this
    try {
      const { cardId, common, adr, date } = ctx.request.body
      await app.mysql.query(`INSERT INTO love100_finished (id, common, adr, date, cardId, off) VALUES (?, ?, ?, ?, ?, 0)`,
        [shortid(), common, adr, date, cardId])
      ctx.body = { status: 1 }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async cardEdit() {
    const { ctx, app } = this
    try {
      const { cardId, common, adr, date, delFlag = false } = ctx.request.body
      await app.mysql.query(`UPDATE love100_finished SET adr = ?, date = ?, off = ? WHERE common = ? AND cardId = ?`,
        [adr, date, delFlag ? 1 : 0, common, cardId])
      ctx.body = { status: 1 }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
