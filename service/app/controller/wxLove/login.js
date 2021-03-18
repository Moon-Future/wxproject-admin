'use strict'
const axios = require('axios')
const { dateFormat } = require('../../utils/index')
const { missLoveConfig } = require('../../../config/secret')
const { transporter, mailOptions } = require('../../utils/email')

const Controller = require('egg').Controller
const api = `https://api.weixin.qq.com/sns/jscode2session?appid=${missLoveConfig.appid}&secret=${missLoveConfig.secret}&grant_type=authorization_code&js_code=`

class HomeController extends Controller {
  async login() {
    const { ctx, app } = this
    const { code } = ctx.request.body
    const res = await axios.get(api + code)
    const accessTokenRes = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${missLoveConfig.appid}&secret=${missLoveConfig.secret}`
    )
    ctx.body = { openid: res.data.openid, session_key: res.data.session_key, access_token: accessTokenRes.data.access_token }
  }

  async register() {
    const { ctx, app } = this
    try {
      const { openid, userInfo } = ctx.request.body
      const result = await app.mysql.query(`SELECT * FROM love_user WHERE id = ?`, [openid])
      if (result.length === 0) {
        await app.mysql.query(`INSERT INTO love_user (id, avatar, nickname, gender, country, province, city, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
          openid,
          userInfo.avatarUrl,
          userInfo.nickName,
          userInfo.gender,
          userInfo.country,
          userInfo.province,
          userInfo.city,
          Date.now(),
        ])
        mailOptions.subject = `失恋营地-新用户`
        mailOptions.html = `
          <h1>有新的注册用户<h1>
          <p>昵称: ${userInfo.nickName}</p>
          <p>头像: <image src="${userInfo.avatarUrl}"></image></p>
          <p>时间：${dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')}</p>
        `
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error)
          }
        })
      } else {
        await app.mysql.query(`UPDATE love_user SET avatar = ?, nickname = ?, gender = ?, country = ?, province = ?, city = ? WHERE id = ?`, [
          userInfo.avatarUrl,
          userInfo.nickName,
          userInfo.gender,
          userInfo.country,
          userInfo.province,
          userInfo.city,
          openid,
        ])
      }
      ctx.body = {}
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = HomeController
