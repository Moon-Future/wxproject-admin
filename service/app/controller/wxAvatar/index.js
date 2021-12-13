'use strict'
const shortid = require('shortid')
const Controller = require('egg').Controller

class HomeController extends Controller {
  async getAvatarAllTab() {
    const { ctx, app } = this
    try {
      let result = await app.mysql.query(`SELECT * FROM avatar_tab WHERE off != 1 ORDER BY sort DESC`)
      ctx.body = { status: 200, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async getAvatarTab() {
    const { ctx, app } = this
    try {
      const { pageNo = 1, pageSize = 20 } = ctx.request.body
      let total = await app.mysql.query(`SELECT COUNT(*) as total FROM avatar_tab WHERE off != 1`)
      let result = await app.mysql.query(`SELECT * FROM avatar_tab WHERE off != 1 ORDER BY sort DESC LIMIT ?, ?`, [(pageNo - 1) * pageSize, pageSize])
      ctx.body = { status: 200, data: result, total: total[0].total }
    } catch (error) {
      throw new Error(error)
    }
  }

  async addAvatarTab() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { id, name, sort = 1 } = ctx.request.body
      if (id) {
        await conn.query(`UPDATE avatar_tab SET name = ?, sort = ? WHERE id = ?`, [name, sort, id])
        await conn.commit()
        ctx.body = { status: 200, message: '更新成功' }
      } else {
        await conn.query(`INSERT INTO avatar_tab (id, name, sort, time) VALUES (?, ?, ?, ?)`, [shortid(), name, sort, new Date().getTime()])
        await conn.commit()
        ctx.body = { status: 200, message: '新增成功' }
      }
    } catch (error) {
      await conn.rollback()
      throw new Error(error)
    }
  }

  async delAvatarTab() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { id } = ctx.request.body
      await conn.query(`UPDATE avatar_tab SET off = 1 WHERE id = ?`, [id])
      await conn.commit()
      ctx.body = { status: 200, message: '删除成功' }
    } catch (error) {
      await conn.rollback()
      throw new Error(error)
    }
  }

  async getAvatarMask() {
    const { ctx, app } = this
    try {
      const { pageNo = 1, pageSize = 20, tab } = ctx.request.body
      let total = 0
      let result = []
      if (!tab) {
        total = await app.mysql.query(`SELECT COUNT(*) as total FROM avatar_mask WHERE off != 1`)
        result = await app.mysql.query(`SELECT m.*, t.name as tabName FROM avatar_mask m, avatar_tab t WHERE m.tab = t.id AND m.off != 1 ORDER BY m.sort DESC LIMIT ?, ?`, [(pageNo - 1) * pageSize, pageSize])
      } else if (tab === 'hot') {
        total = await app.mysql.query(`SELECT COUNT(*) as total FROM avatar_mask WHERE off != 1 AND hot = 1`)
        result = await app.mysql.query(`SELECT m.*, t.name as tabName FROM avatar_mask m, avatar_tab t WHERE m.tab = t.id AND m.off != 1 AND hot = 1 ORDER BY m.sort DESC LIMIT ?, ?`, [(pageNo - 1) * pageSize, pageSize])
      } else {
        total = await app.mysql.query(`SELECT COUNT(*) as total FROM avatar_mask WHERE off != 1 AND tab = ?`, [tab])
        result = await app.mysql.query(`SELECT m.*, t.name as tabName FROM avatar_mask m, avatar_tab t WHERE m.tab = t.id AND m.off != 1 AND m.tab = ? ORDER BY m.sort DESC LIMIT ?, ?`, [tab, (pageNo - 1) * pageSize, pageSize])
      }
      ctx.body = { status: 200, data: result, total: total[0].total }
    } catch (error) {
      throw new Error(error)
    }
  }

  async addAvatarMask() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { id, name, src, tab, cover = 0, sort = 1, hot = 0 } = ctx.request.body
      if (id) {
        await conn.query(`UPDATE avatar_mask SET name = ?, src = ?, tab = ?, cover = ?, sort = ?, hot = ? WHERE id = ?`, [name, src, tab, cover, sort, hot, id])
        await conn.commit()
        ctx.body = { status: 200, message: '更新成功' }
      } else {
        await conn.query(`INSERT INTO avatar_mask (id, name, src, tab, cover, sort, hot, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [shortid(), name, src, tab, cover, sort, hot, new Date().getTime()])
        await conn.commit()
        ctx.body = { status: 200, message: '新增成功' }
      }
    } catch (error) {
      await conn.rollback()
      throw new Error(error)
    }
  }

  async delAvatarMask() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { id } = ctx.request.body
      await conn.query(`UPDATE avatar_mask SET off = 1 WHERE id = ?`, [id])
      await conn.commit()
      ctx.body = { status: 200, message: '删除成功' }
    } catch (error) {
      await conn.rollback()
      throw new Error(error)
    }
  }

}

module.exports = HomeController
