'use strict'
const shortid = require('shortid')

const Controller = require('egg').Controller

class HomeController extends Controller {
  async addMemory() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { title, dateInfo, user, id } = ctx.request.body
      if (id) {
        const result = await conn.query(`SELECT * FROM love100_memory WHERE id = ?`, [id])
        let obj = result[0]
        await conn.query(`UPDATE love100_memory SET title = ?, date = ?, isLunar = ?, updateTime = ? WHERE id = ?`, [title, dateInfo.isLunar ? dateInfo.lunarDate : dateInfo.date, dateInfo.isLunar, Date.now(), id])
        await conn.commit()
        obj.title = title
        obj.date = dateInfo.isLunar ? dateInfo.lunarDate : dateInfo.date
        obj.isLunar = dateInfo.isLunar
        ctx.body = { status: 1, message: '更新成功', data: obj }
      } else {
        const newId = shortid()
        await conn.query(`INSERT INTO love100_memory (id, user, title, date, isLunar, createTime) VALUES (?, ?, ?, ?, ?, ?)`, 
        [newId, user, title, dateInfo.isLunar ? dateInfo.lunarDate : dateInfo.date, dateInfo.isLunar, Date.now()])
        const result = await conn.query(`SELECT * FROM love100_memory WHERE id = ?`, [newId])
        await conn.commit()
        ctx.body = { status: 1, message: '保存成功', data: result[0] }
      }
    } catch (e) {
      console.log('----------error', e)
      await conn.rollback()
      ctx.body = { message: '服务端出错' }
    }
  }

  async deleteMemory() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { user, id } = ctx.request.body
      await conn.query(`UPDATE love100_memory SET off = 1 WHERE id = ?`, [id])
      await conn.commit()
      ctx.body = { status: 1, message: '删除成功', data: {} }
    } catch (e) {
      console.log('----------error', e)
      await conn.rollback()
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
