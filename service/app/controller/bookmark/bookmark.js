'use strict';
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async importBookmark() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { bookmarks } = ctx.request.body
      let insetSql = 'INSERT INTO bookmark_bookmark (id, name, url, icon, folder, parent, sort, user, create_time) VALUES '
      let fields = []
      let data = []
      for (let key in bookmarks) {
        const item = bookmarks[key]
        const arr = [item.id, item.label, item.url || '', item.icon || '', item.folder ? 1 : 0, item.parentId, item.sort, '8023', item.createTime]
        const list = ['?', '?', '?', '?', '?', '?', '?', '?', '?']
        data.push(...arr)
        fields.push(`(${list.join(',')})`)
      }
      await conn.query(`${insetSql}${fields.join(',')}`, data)
      await conn.commit()
      ctx.body = { status: 1 }
    } catch(e) {
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

module.exports = HomeController;
