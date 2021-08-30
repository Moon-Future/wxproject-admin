'use strict'
const shortid = require('shortid')
const Controller = require('egg').Controller

class HomeController extends Controller {
  async toBeLover() {
    const { ctx, app } = this
    try {
      const { from, to } = ctx.request.body
      const result = await app.mysql.query(`SELECT * FROM love100_user WHERE id IN (?, ?)`, [from, to])
      let fromData = null, toData = null
      result.forEach(ele => {
        if (ele.id === from) {
          fromData = ele
        }
        if (ele.id === to) {
          toData = ele
        }
      })
      if (!fromData) {
        ctx.body = { status: 0, message: '邀请者不存在' }
        return 
      }
      if (!toData) {
        ctx.body = { status: 0, message: '当前用户不存在或未登录' }
        return 
      }
      // 已存在对象，且不是对方
      if ((fromData.lover && fromData.lover !== to) || (toData.lover && toData.lover !== from)) {
        ctx.body = { status: 0, message: '牵手失败，请确保两人都是单身！' }
        return 
      }
      if (fromData.lover === to && toData.lover === from) {
        ctx.body = { status: 1, message: '你们早已经是恋人啦~' }
        return
      }

      // 判断之前是否已经是情侣
      let common = ''
      const loverResult = await app.mysql.query(`SELECT * FROM love100_lover WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?) AND off = 1`, [from, to, to, from])
      if (loverResult.length) {
        common = loverResult[0].common
        await app.mysql.query(`UPDATE love100_lover SET off = 0 WHERE common = ?`, [common])
      } else {
        common = shortid()
        await app.mysql.query(`INSERT INTO love100_lover (id, common, user1, user2, time) VALUES (?, ?, ?, ?, ?)`, [shortid(), common, from, to, Date.now()])
      }
      await app.mysql.query(`
        UPDATE love100_user SET lover = CASE id
          WHEN ? THEN ?
          WHEN ? THEN ?
        END, common = ? WHERE id IN (?, ?)
      `, [from, to, to, from, common, from, to])

      const date = Date.now()
      await app.mysql.query(`INSERT INTO love100_message (id, title, content, userId, fromId, date, reador) VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)`, 
        [shortid(), '牵手成功', `${toData.nickName}已接受您的邀请，愿得一人心，白首不相离`, from, 'system', date, 0,
          shortid(), '牵手成功', `您已接受${fromData.nickName}的邀请，愿得一人心，白首不相离`, to, 'system', date, 1,
        ])

      ctx.body = { status: 1, message: '牵手成功！', data: { common } }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async refuse() {
    const { ctx, app } = this
    try {
      const { userInfo, invitedFrom } = ctx.request.body
      const time = Date.now()
      await app.mysql.query(`INSERT INTO love100_message (id, title, content, userId, fromId, date, reador) VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)`, 
        [shortid(), '十动然拒', `${userInfo.nickName}十分感动， 然后拒绝了您的邀请`, invitedFrom.id, 'system', time, 0,
          shortid(), '十动然拒', `您十分感动，然后拒绝了${invitedFrom.nickName}的邀请`, userInfo.id, 'system', time, 1
        ])
      ctx.body = { status: 1 }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async breakup() {
    const { ctx, app } = this
    try {
      const { id, nickName, lover, loverNickName, common } = ctx.request.body
      const result = await app.mysql.query(`SELECT * FROM love100_user WHERE id IN (?, ?)`, [id, lover])
      let selfData = null, loverData = null
      result.forEach(ele => {
        if (ele.id === id) {
          selfData = ele
        }
        if (ele.id === lover) {
          loverData = ele
        }
      })
      await app.mysql.query(`UPDATE love100_user SET lover = '', common = '' WHERE id IN (?, ?)`, [id, lover])
      await app.mysql.query(`UPDATE love100_lover SET off = 1 WHERE common = ?`, [common])

      const date = Date.now()
      await app.mysql.query(`INSERT INTO love100_message (id, title, content, userId, fromId, date, reador) VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)`, 
        [shortid(), '有缘再牵', `${nickName}断绝了和您的关系，也许你的真爱还在下一秒等着你`, lover, 'system', date, 0,
          shortid(), '有缘再牵', `您断绝了和${loverNickName}的关系，也许你的真爱还在下一秒等着你`, id, 'system', date, 1
        ])
      ctx.body = { status: 1, message: '天下无不散的宴席' }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async getMessage() {
    const { ctx, app } = this
    try {
      const { user } = ctx.request.body
      const result = await app.mysql.query(`SELECT * FROM love100_message WHERE userId = ? ORDER BY date DESC`, [user])
      ctx.body = { status: 1, messageList: result }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async readMessage() {
    const { ctx, app } = this
    try {
      const { id, user } = ctx.request.body
      if (user) {
        await app.mysql.query(`UPDATE love100_message SET reador = 1 WHERE userId = ?`, [user])
      } else {
        await app.mysql.query(`UPDATE love100_message SET reador = 1 WHERE id = ?`, [id])
      }
      ctx.body = { status: 1 }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
