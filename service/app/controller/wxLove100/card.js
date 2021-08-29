'use strict'
const shortid = require('shortid')
const Controller = require('egg').Controller

class HomeController extends Controller {
  async getCardList() {
    const { ctx, app } = this
    try {
      const { common } = ctx.request.body
      const cardList = await app.mysql.query(`SELECT * FROM love100_card WHERE verify = ? AND off = ? ORDER BY date`, [1, 0])
      let finishedList = []
      if (common) {
        finishedList = await app.mysql.query(`SELECT * FROM love100_finished WHERE common = ? AND off != 1`, [common])
      }
      ctx.body = { status: 1, cardList: cardList, finishedList: finishedList }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async cardFinished() {
    const { ctx, app } = this
    try {
      const { cardId, common, adr, date } = ctx.request.body
      const result = await app.mysql.query(`SELECT * FROM love100_lover WHERE common = ? AND off != 1`, [common])
      if (!result.length) {
        ctx.body = { status: 0, message: '请邀请对象一起完成哦~' }
        return
      }
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
      const { common, adr, date, finishedId, delFlag = false } = ctx.request.body
      const result = await app.mysql.query(`SELECT * FROM love100_lover WHERE common = ? AND off != 1`, [common])
      if (!result.length) {
        ctx.body = { status: 0, message: '请邀请对象一起完成哦~' }
        return
      }
      await app.mysql.query(`UPDATE love100_finished SET adr = ?, date = ?, off = ? WHERE id = ?`,
        [adr, date, delFlag ? 1 : 0, finishedId])
      ctx.body = { status: 1, finishedId: finishedId }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async getSentence() {
    const { ctx, app } = this
    try {
      const result = await app.mysql.query(`SELECT * from love100_sentence WHERE off != 1 ORDER BY rand() LIMIT 1 `)
      ctx.body = { status: 1, data: result.length ? result[0].content : '' }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
