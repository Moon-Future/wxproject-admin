'use strict'
const shortid = require('shortid')
const Controller = require('egg').Controller

class HomeController extends Controller {
  async getCardList() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { common } = ctx.request.body
      const cardList = await conn.query(`SELECT * FROM love100_card WHERE verify = ? AND off = ? ORDER BY date`, [1, 0])
      let finishedList = []
      if (common) {
        finishedList = await conn.query(`SELECT * FROM love100_finished WHERE common = ? AND off != 1`, [common])
      }
      await conn.commit()
      ctx.body = { status: 1, cardList: cardList, finishedList: finishedList }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async cardFinished() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { cardId, common, adr, date, userInfo, cardTitle } = ctx.request.body
      const result = await conn.query(`SELECT * FROM love100_lover WHERE common = ? AND off != 1`, [common])
      if (!result.length) {
        ctx.body = { status: 0, message: '请邀请对象一起完成哦~' }
        return
      }
      let finishedId = ''
      const finishDelete = await conn.query(`SELECT * FROM love100_finished WHERE common = ? AND cardId = ?`, [common, cardId])
      if (finishDelete.length) {
        finishedId = finishDelete[0].id
        await conn.query(`UPDATE love100_finished SET adr = ?, date = ?, off = 0 WHERE id = ?`, [adr, date, finishedId])
      } else {
        finishedId = shortid()
        await conn.query(`INSERT INTO love100_finished (id, common, adr, date, cardId, off) VALUES (?, ?, ?, ?, ?, 0)`,
          [finishedId, common, adr, date, cardId])
      }

      const time = Date.now()
      await conn.query(`INSERT INTO love100_message (id, title, content, userId, fromId, date, reador) VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)`, 
        [shortid(), '一路有你', `${userInfo.nickName}和您共同完成了【${cardTitle}】`, userInfo.lover, 'system', time, 0,
          shortid(), '一路有你', `您和${userInfo.loverNickName}共同完成了【${cardTitle}】`, userInfo.id, 'system', time, 1
        ])

      await conn.commit()
      ctx.body = { status: 1, finishedId: finishedId }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async cardEdit() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { common, adr, date, finishedId, delFlag = false, userInfo, cardTitle } = ctx.request.body
      const result = await conn.query(`SELECT * FROM love100_lover WHERE common = ? AND off != 1`, [common])
      if (!result.length) {
        ctx.body = { status: 0, message: '请邀请对象一起完成哦~' }
        return
      }
      await conn.query(`UPDATE love100_finished SET adr = ?, date = ?, off = ? WHERE id = ?`,
        [adr, date, delFlag ? 1 : 0, finishedId])

      const time = Date.now()
      if (delFlag) {
        await conn.query(`INSERT INTO love100_message (id, title, content, userId, fromId, date, reador) VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)`, 
          [shortid(), '一路有你', `${userInfo.nickName}取消了已完成事件【${cardTitle}】`, userInfo.lover, 'system', time, 0,
            shortid(), '一路有你', `您取消了已完成事件【${cardTitle}】`, userInfo.id, 'system', time, 1
          ])
      }
      
      await conn.commit()
      ctx.body = { status: 1, finishedId: finishedId }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async getSentence() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const result = await conn.query(`SELECT * from love100_sentence WHERE off != 1 ORDER BY rand() LIMIT 1 `)
      await conn.commit()
      ctx.body = { status: 1, data: result.length ? result[0].content : '' }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
