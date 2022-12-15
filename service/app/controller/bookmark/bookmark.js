'use strict'
const Controller = require('egg').Controller
const { getWebSiteInfo } = require('../../utils/index')
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
        where: { parent_id: parentID, delete_status: 0 },
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
        if (ids.length) {
          await conn.update(
            'bookmark_bookmark',
            { delete_status: 1 },
            {
              where: { id: ids },
            }
          )
        }
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
        where: { delete_status: 0 },
      })
      await conn.commit()
      ctx.body = { status: 1, data: res }
    } catch (e) {
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
    } catch (e) {
      throw new eor(err)
    }
  }

  async saveNewNode() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      let { parentID, id, name, url, icon, folderStatus } = ctx.request.body

      let sort = 1
      const res = await conn.select('bookmark_bookmark', {
        where: { parent_id: parentID, delete_status: 0 },
      })
      if (res.length) {
        res.sort((a, b) => {
          return a.sort_number - b.sort_number
        })
        sort = res[res.length - 1].sort_number + 1
      }
      if (!folderStatus) {
        const webInfo = await getWebIcon(url, conn)
        icon = webInfo.iconUrl
      }
      await conn.insert('bookmark_bookmark', {
        id,
        web_name: name,
        web_url: url,
        icon_url: icon,
        folder_status: folderStatus ? 1 : 0,
        parent_id: parentID,
        sort_number: sort,
      })
      await conn.commit()
      ctx.body = { status: 1, data: { sort, icon } }
    } catch (e) {
      await conn.rollback()
      console.log(e)
      ctx.status = 500
      ctx.body = { message: '服务端出错' }
    }
  }

  async getWebsiteTitleAndIcon() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { url } = ctx.request.body
      let firstNotW = false // 一级域名不带www
      let hostUrl = url.replace('https://', '').replace('http://', '').split('/')[0]
      if (hostUrl.split('.').length === 2) {
        hostUrl = `www.${hostUrl}`
        firstNotW = true
      }
      const res = await conn.get('bookmark_webicon', { web_url: hostUrl })
      let title = ''
      let iconUrl = ''
      if (res) {
        iconUrl = res.icon_url
      } else {
        const infoRes = await getWebSiteInfo(url)
        title = infoRes.title
        iconUrl = infoRes.iconUrl
        if (iconUrl) {
          await conn.insert('bookmark_webicon', { web_url: hostUrl, icon_url: iconUrl })
        }
      }
      await conn.commit()
      ctx.body = { status: 1, title, iconUrl }
    } catch (e) {
      await conn.rollback()
      console.log(e)
      ctx.status = 500
      ctx.body = { message: '服务端出错' }
    }
  }
}

const getWebIcon = async (url, conn) => {
  let firstNotW = false // 一级域名不带www
  let hostUrl = url.replace('https://', '').replace('http://', '').split('/')[0]
  if (hostUrl.split('.').length === 2) {
    hostUrl = `www.${hostUrl}`
    firstNotW = true
  }
  const res = await conn.get('bookmark_webicon', { web_url: hostUrl })
  let title = ''
  let iconUrl = ''
  if (res) {
    iconUrl = res.icon_url
  } else {
    const infoRes = await getWebSiteInfo(url)
    title = infoRes.title
    iconUrl = infoRes.iconUrl
    if (iconUrl) {
      await conn.insert('bookmark_webicon', { web_url: hostUrl, icon_url: iconUrl })
    }
  }
  return { title, iconUrl }
}

// 图标抓取工具,帮您快速的定位网页的favicon.ico图标网址,先分析当前网址shortcut标签,如果不存在,则访问网站首页,如果首页shortcut标签也不存在,则访问默认的根目录favicon.ico图标。

module.exports = HomeController
