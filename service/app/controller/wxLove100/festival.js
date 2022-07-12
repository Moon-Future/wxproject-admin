'use strict'
const shortid = require('shortid')
const { cosUpload } = require('../../utils/index')

const Controller = require('egg').Controller

class HomeController extends Controller {
  async getFestival() {
    const { ctx, app } = this
    try {
      const { user } = ctx.request.body
      const userRes = await app.mysql.query(`SELECT * FROM love100_user WHERE id = ?`, [user])
      let common = ''
      let finishedList = []
      let memoryList = []
      if (userRes.length) {
        common = userRes[0].common
      }
      // 获取一起完成事件
      if (common) {
        const userList = await app.mysql.query(`SELECT * FROM love100_user WHERE common = ?`, [common])
        let obj = {}
        userList.forEach(item => {
          if (item.id === user) {
            obj.fromUser = item.id
            obj.fromUserName = item.nickName || '你'
            obj.fromUserAvatar = item.avatarUrl
          } else {
            obj.toUser = item.id
            obj.toUserName = item.nickName || '爱人'
            obj.toUserAvatar = item.avatarUrl
          }
        })
        finishedList = await app.mysql.query(`SELECT f.*, c.title, c.url FROM love100_finished f, love100_card c WHERE f.off != 1 AND f.common = ? AND f.cardId = c.id AND c.verify = 1 AND c.off != 1`, [common])
        finishedList = finishedList.map(item => {
          return Object.assign({}, item, obj)
        })
      }
      // 获取添加的纪念日
      ctx.body = { status: 1, finishedList, memoryList }
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = HomeController
