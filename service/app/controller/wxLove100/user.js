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
      const common = shortid()
      const time = Date.now()
      await app.mysql.query(`
        UPDATE love100_user SET lover = CASE id
          WHEN ? THEN ?
          WHEN ? THEN ?
        END, common = ? WHERE id IN (?, ?)
      `, [from, to, to, from, common, from, to])
      await app.mysql.query(`INSERT INTO love100_lover (id, common, user, time) VALUES (?, ?, ?, ?), (?, ?, ?, ?)`, [shortid(), common, from, time, shortid(), common, to, time])
      ctx.body = { status: 1, message: '牵手成功！', data: { common } }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async breakup () {
    const { ctx, app } = this
    try {
      const { id, lover, common } = ctx.request.body
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
      ctx.body = { status: 1, message: '天下无不散的宴席' }
    } catch(e) {
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
