'use strict'
const shortid = require('shortid')
const Controller = require('egg').Controller

class HomeController extends Controller {
  async getCardList() {
    const { ctx, app } = this
    try {
      const { common } = ctx.request.body
      const cardList = await app.mysql.query(`SELECT * FROM love100_card WHERE verify = ? AND off = ?`, [1, 0])
      let finishedList = []
      if (common) {
        finishedList = await app.mysql.query(`SELECT * FROM love100_finished WHERE common = ? AND off != 1`, [common])
      }
      ctx.body = { status: 1, cardList: cardList, finishedList: finishedList }
    } catch(e) {
      ctx.body = { message: '服务端出错' }
    }
  }

  async cardFinished() {
    const { ctx, app } = this
    try {
      const { cardId, common, adr, date } = ctx.request.body
      const finishedId = shortid()
      await app.mysql.query(`INSERT INTO love100_finished (id, common, adr, date, cardId, off) VALUES (?, ?, ?, ?, ?, 0)`,
        [finishedId, common, adr, date, cardId])
      ctx.body = { status: 1, finishedId: finishedId }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async cardEdit() {
    const { ctx, app } = this
    try {
      const { adr, date, finishedId, delFlag = false } = ctx.request.body
      await app.mysql.query(`UPDATE love100_finished SET adr = ?, date = ?, off = ? WHERE id = ?`,
        [adr, date, delFlag ? 1 : 0, finishedId])
      ctx.body = { status: 1, finishedId: finishedId }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
