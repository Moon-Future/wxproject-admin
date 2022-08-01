'use strict'
const axios = require('axios')
const { Love100Config } = require('../../../config/secret')

const Controller = require('egg').Controller
const api = `https://api.weixin.qq.com/sns/jscode2session?appid=${Love100Config.appid}&secret=${Love100Config.secret}&grant_type=authorization_code&js_code=`

class HomeController extends Controller {
  async login() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { code } = ctx.request.body
      const res = await axios.get(api + code)
      const accessTokenRes = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${Love100Config.appid}&secret=${Love100Config.secret}`
      )
      const openid = res.data.openid
      let userInfo = await conn.query(`SELECT * FROM love100_user WHERE id = ?`, [openid])
      if (userInfo.length === 0) {
        await conn.query(`INSERT INTO love100_user (id, time) VALUES (?, ?)`, [openid, Date.now()])
        userInfo = [{ id: openid }]
      } else {
        let res = await conn.query(`SELECT a.*, b.nickName as loverNickName, b.avatarUrl as loverAvatarUrl 
        FROM love100_user a, love100_user b WHERE a.id = ? AND a.lover = b.id`, [openid])
        userInfo = res.length ? res : userInfo
      }
      await conn.commit()
      ctx.body = { userInfo: userInfo[0], access_token: accessTokenRes.data.access_token }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async updateUserInfo() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const userInfo = ctx.request.body
      await conn.query(`UPDATE love100_user SET nickName = ?, avatarUrl = ?, country = ?, province = ?, city = ?, gender = ?
        WHERE id = ?`, [userInfo.nickName, userInfo.avatarUrl, userInfo.country, userInfo.province, userInfo.city, userInfo.gender, userInfo.id])
      await conn.commit()
      ctx.body = { message: 'OK' }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async getControl() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const result =  await conn.query(`SELECT * FROM love100_control`)
      await conn.commit()
      ctx.body = { message: 'OK', controlMap: result.length ? result[0] : {} }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
