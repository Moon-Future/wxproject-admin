'use strict'
const axios = require('axios')
const { Love100Config } = require('../../../config/secret')

const Controller = require('egg').Controller
const api = `https://api.weixin.qq.com/sns/jscode2session?appid=${Love100Config.appid}&secret=${Love100Config.secret}&grant_type=authorization_code&js_code=`

class HomeController extends Controller {
  async login() {
    const { ctx, app } = this
    const { code } = ctx.request.body
    const res = await axios.get(api + code)
    const accessTokenRes = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${Love100Config.appid}&secret=${Love100Config.secret}`
    )
    const openid = res.data.openid
    let userInfo = await app.mysql.query(`SELECT * FROM love100_user WHERE id = ?`, [openid])
    if (userInfo.length === 0) {
      await app.mysql.query(`INSERT INTO love100_user (id, time) VALUES (?, ?)`, [openid, Date.now()])
      userInfo = [{ id: openid }]
    }
    ctx.body = { userInfo: userInfo[0], session_key: res.data.session_key, access_token: accessTokenRes.data.access_token }
  }

  async updateUserInfo() {
    const { ctx, app } = this
    const userInfo = ctx.request.body
    await app.mysql.query(`UPDATE love100_user SET nickName = ?, avatarUrl = ?, country = ?, province = ?, city = ?, gender = ?
      WHERE id = ?`, [userInfo.nickName, userInfo.avatarUrl, userInfo.country, userInfo.province, userInfo.city, userInfo.gender, userInfo.id])
    ctx.status = 200
    ctx.body = { message: 'OK' }  
  }
}

module.exports = HomeController
