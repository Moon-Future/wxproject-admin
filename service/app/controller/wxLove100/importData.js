'use strict'
const shortid = require('shortid')
const { cards } = require('./data')
const Controller = require('egg').Controller

class HomeController extends Controller {
  async importCardList() {
    const { ctx, app } = this
    try {
      cards.reverse()
      const imageUrl = 'https://love100-1255423800.cos.ap-shanghai.myqcloud.com/images/card/'
      for (let i = 0, len = cards.length; i < len; i++) {
        let item = cards[i]
        await app.mysql.query(`INSERT INTO love100_card (id, title, url, width, height, adrWidth, adrHeight, dateWidth, dateHeight, fingerWidth, fingerHeight, date, verify) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`, [i + 1, item.title, `${imageUrl}${item.index}.JPG`, item.width, item.height, item.adrWidth, item.adrHeight, item.dateWidth, item.dateHeight,
          item.fingerWidth, item.fingerHeight, Date.now()])
      }
      ctx.body = '导入成功'
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
