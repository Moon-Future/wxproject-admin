'use strict'
const shortid = require('shortid')
const Controller = require('egg').Controller

class HomeController extends Controller {
  async getAvatarTab() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { pageNo = 1, pageSize = 20 } = ctx.request.body
      let total = await conn.query(`SELECT COUNT(*) as total FROM avatar_tab`)
      let result = await conn.query(`SELECT * FROM avatar_tab WHERE off != 1 ORDER BY sort DESC LIMIT ?, ?`, [(pageNo - 1) * pageSize, pageSize])
      ctx.body = { status: 200, data: result, total: total[0].total }
    } catch (error) {
      throw new Error(error)
    }
  }

  async addAvatarTab() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { name, sort } = ctx.request.body
      await conn.query(`INSERT INTO avatar_tab (id, name, sort) VALUES (?, ?, ?)`, [shortid(), name, sort])
      await conn.commit()
      ctx.body = { status: 200, message: '新增成功' }
    } catch (error) {
      await conn.rollback()
      throw new Error(error)
    }
  }
}

module.exports = HomeController
