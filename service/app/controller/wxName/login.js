'use strict';
const axios = require('axios')
const { wxNameConfig } = require('../../../config/secret')

const Controller = require('egg').Controller;
const api = `https://api.weixin.qq.com/sns/jscode2session?appid=${wxNameConfig.appid}&secret=${wxNameConfig.secret}&grant_type=authorization_code&js_code=`

class HomeController extends Controller {
  async getAccessToken() {
    const { ctx } = this
    const { code } = ctx.request.body
    const res = await axios.get(api + code)
    const accessTokenRes = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxNameConfig.appid}&secret=${wxNameConfig.secret}`
    )
    ctx.body = { openid: res.data.openid, session_key: res.data.session_key, access_token: accessTokenRes.data.access_token }
  }
}

module.exports = HomeController;
