'use strict'
const shortid = require('shortid')
const Controller = require('egg').Controller

class HomeController extends Controller {
  async importMask() {
    const { ctx, app } = this
    try {
      const imageUrl = 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/mask/'
      for (let i = 0, len = 1; i < len; i++) {
        let index = (i + 1 >= 10) ? `${i+1}` : `0${i+1}`
        await app.mysql.query(`INSERT INTO avatar_mask (id, name, src, tab, cover, sort, hot, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [shortid(), `圣诞帽-${index}`, `${imageUrl}shengdan-${index}.png`, '2', 0, len - i, 0, new Date().getTime()])
      }
      ctx.body = '导入成功'
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
