'use strict'
const shortid = require('shortid')

const Controller = require('egg').Controller

class HomeController extends Controller {
  async addMemory() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { title, dateInfo, user } = ctx.request.body
      await conn.query(`INSERT INTO love100_memory (id, user, title, date, isLunar, createTime) VALUES (?, ?, ?, ?, ?, ?)`, 
      [shortid(), user, title, dateInfo.isLunar ? dateInfo.lunarDate : dateInfo.date, dateInfo.isLunar, Date.now()])
      await conn.commit()
      ctx.body = { status: 1, message: '保存成功' }
    } catch (err) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async getMemory() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { user } = ctx.request.body
      const result = await conn.query(`SELECT * FROM love100_memory WHERE user = ? AND off != 1`, [user])
      await conn.commit()
      ctx.body = { status: 1, memoryList: result }
    } catch (err) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
