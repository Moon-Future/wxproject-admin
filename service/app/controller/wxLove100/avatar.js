'use strict'
const shortid = require('shortid')
const { cosUpload } = require('../../utils/index')
const { tencentCloud } = require('../../../config/secret')

const Controller = require('egg').Controller

class HomeController extends Controller {
  async uploadAvatar() {
    const { ctx } = this
    try {
      const file = ctx.request.files[0]
      const { filepath } = file
      const result = await cosUpload(`upload/avatar/avatar_${shortid()}.jpg`, filepath, tencentCloud.love100)
      ctx.body = { filePath: result.Location }
    } catch (err) {
      throw new Error(err)
    }
  }

  async saveAvatar() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { avatar1, avatar2, hot } = ctx.request.body
      await conn.query(`INSERT INTO love100_avatar (id, avatar1, avatar2, hot, create_time) VALUES (?, ?, ?, ?, ?)`, [shortid(), avatar1, avatar2, hot || 1, Date.now()])
      await conn.commit()
      ctx.body = { status: 1, message: '保存成功' }
    } catch (e) {
      console.log('----------error', e)
      await conn.rollback()
      ctx.body = { message: '服务端出错' }
    }
  }

  async getAvatarList() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { pageNo, pageSize } = ctx.request.body
      const res = await conn.query(`SELECT * FROM love100_avatar WHERE off != 1 ORDER BY hot DESC LIMIT ?, ?`, [(pageNo - 1) * pageSize, pageSize])
      const count = (await app.mysql.query(`SELECT COUNT(*) as count FROM love100_avatar WHERE off != 1`)) || [{ count: 0 }]
      await conn.commit()
      ctx.body = { status: 1, data: res, total: count[0].count }
    } catch (e) {
      console.log('----------error', e)
      await conn.rollback()
      ctx.body = { message: '服务端出错' }
    }
  }

  async modifyAvatar() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { operate, id, avatar1, avatar2, hot } = ctx.request.body
      if (operate === 3) {
        await conn.query(`UPDATE love100_avatar set off = 1 WHERE id = ?`, [id])
      } else {
        await conn.query(`UPDATE love100_avatar set avatar1 = ?, avatar2 = ?, hot = ? WHERE id = ?`, [avatar1, avatar2, hot || 1, id])
      }
      await conn.commit()
      ctx.body = { status: 1 }
    } catch (e) {
      console.log('----------error', e)
      await conn.rollback()
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
