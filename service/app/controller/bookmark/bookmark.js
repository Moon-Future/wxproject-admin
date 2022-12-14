'use strict'
const Controller = require('egg').Controller

class HomeController extends Controller {
  async importBookmark() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { bookmarks } = ctx.request.body
      const insertData = []
      for (let key in bookmarks) {
        const item = bookmarks[key]
        insertData.push({
          id: item.id,
          web_name: item.label,
          web_url: item.url || '',
          icon_url: item.icon || '',
          folder_status: item.folder ? 1 : 0,
          parent_id: item.parentId,
          sort_number: item.sort,
          user_id: '8023',
        })
      }
      await conn.insert('bookmark_bookmark', insertData)
      await conn.commit()
      ctx.body = { status: 1 }
    } catch (e) {
      await conn.rollback()
      console.log(e)
      ctx.status = 500
      ctx.body = { message: '服务端出错' }
    }
  }

  async modifyBookmark() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { bookmark } = ctx.request.body
      const { id, name, url, icon } = bookmark
      const updateData = { id, web_name: name, web_url: url, icon_url: icon }
      await conn.update('bookmark_bookmark', updateData)
      await conn.commit()
      ctx.body = { status: 1 }
    } catch (e) {
      await conn.rollback()
      console.log(e)
      ctx.status = 500
      ctx.body = { message: '服务端出错' }
    }
  }

  async moveBookmark() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { bookmark, parentID } = ctx.request.body
      const { id, folder } = bookmark
      let sort = 1
      const res = await conn.select('bookmark_bookmark', {
        where: { parent_id: parentID }
      })
      if (res.length) {
        res.sort((a, b) => {
          return a.sort_number - b.sort_number
        })
        sort = res[res.length - 1].sort_number + 1
      }
      await conn.update('bookmark_bookmark', { id, parent_id: parentID, sort_number: sort })
      await conn.commit()
      ctx.body = { status: 1 }
    } catch (e) {
      await conn.rollback()
      console.log(e)
      ctx.status = 500
      ctx.body = { message: '服务端出错' }
    }
  }

  async removeBookmark() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { bookmark } = ctx.request.body
      const { id, folder } = bookmark
      let folderStatus = !!folder
      let ids = [id]
      await conn.update('bookmark_bookmark', { id, delete_status: 1 })
      while (folderStatus) {
        const res = await conn.select('bookmark_bookmark', {
          where: { delete_status: 0, parent_id: ids },
        })
        folderStatus = false
        ids = []
        for (let i = 0, len = res.length; i < len; i++) {
          if (res[i].folder_status) {
            folderStatus = true
          }
          ids.push(res[i].id)
        }
        await conn.update(
          'bookmark_bookmark',
          { delete_status: 1 },
          {
            where: { id: ids },
          }
        )
      }
      await conn.commit()
      ctx.body = { status: 1 }
    } catch (e) {
      await conn.rollback()
      console.log(e)
      ctx.status = 500
      ctx.body = { message: '服务端出错' }
    }
  }

  async sortBookmark() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { sortMap } = ctx.request.body
      for (let key in sortMap) {
        await conn.update('bookmark_bookmark', { id: key, sort_number: sortMap[key] })
      }
      await conn.commit()
      ctx.body = { status: 1 }
    } catch (e) {
      await conn.rollback()
      console.log(e)
      ctx.status = 500
      ctx.body = { message: '服务端出错' }
    }
  }

  async getBookmark() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { userId } = ctx.request.body
      const res = await conn.select('bookmark_bookmark', {
        where: { delete_status: 0 }
      })
      await conn.commit()
      ctx.body = { status: 1, data: res }
    } catch (err) {
      await conn.rollback()
      console.log(e)
      ctx.status = 500
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
