'use strict'
const Controller = require('egg').Controller

class HomeController extends Controller {
  async importBookmark() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { bookmarks } = ctx.request.body
      let insetSql = 'INSERT INTO bookmark_bookmark (id, web_name, web_url, icon_url, folder_status, parent_id, sort_number, user_id) VALUES '
      let fields = []
      let data = []
      for (let key in bookmarks) {
        const item = bookmarks[key]
        const arr = [item.id, item.label, item.url || '', item.icon || '', item.folder ? 1 : 0, item.parentId, item.sort, '8023']
        const list = ['?', '?', '?', '?', '?', '?', '?', '?']
        data.push(...arr)
        fields.push(`(${list.join(',')})`)
      }
      await conn.query(`${insetSql}${fields.join(',')}`, data)
      await conn.commit()
      ctx.body = { status: 1 }
    } catch (e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async modifyBookmark() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { bookmark } = ctx.request.body
      const { id, name, url, icon } = bookmark
      await conn.query(`UPDATE bookmark_bookmark SET web_name = ?, web_url = ?, icon_url = ? WHERE id = ?`, [name, url, icon, id])
      await conn.commit()
      ctx.body = { status: 1 }
    } catch (e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async removeBookmark() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { bookmark } = ctx.request.body
      const { id, folder } = bookmark
      await conn.query(`UPDATE bookmark_bookmark SET delete_status = 1 WHERE id = ?`, [id])
      await conn.commit()
      ctx.body = { status: 1 }
    } catch (e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async getBookmark() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { userId } = ctx.request.body
      const res = await conn.query(`SELECT * FROM bookmark_bookmark WHERE delete_status != 1`)
      await conn.commit()
      ctx.body = { status: 1, data: res }
    } catch (err) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async addBookmark() {
    const { ctx, app } = this
    try {
      const { bookmarks } = ctx.request.body
      console.log(bookmarks)
      ctx.body = 'ok'
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = HomeController
