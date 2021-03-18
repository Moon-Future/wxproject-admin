'use strict'
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const request = require('request')
const { missLoveConfig } = require('../../../config/secret')

const Controller = require('egg').Controller

class HomeController extends Controller {
  async getAccessToken() {
    const { ctx } = this
    try {
      const res = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${missLoveConfig.appid}&secret=${missLoveConfig.secret}`
      )
      ctx.body = { access_token: res.data.access_token }
    } catch (err) {
      throw new Error(err)
    }
  }

  async textCheck() {
    const { ctx } = this
    try {
      const { access_token, content } = ctx.request.body
      const res = await axios({
        method: 'POST',
        url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + access_token,
        data: {
          content: content,
        },
      })
      ctx.body = res.data
    } catch (err) {
      throw new Error(err)
    }
  }

  async imageCheck() {
    const { ctx } = this
    try {
      const { access_token } = ctx.request.body
      const url = 'https://api.weixin.qq.com/wxa/img_sec_check?access_token=' + access_token
      const file = ctx.request.files[0]
      const stream = fs.createReadStream(file.filepath)
      const form = new FormData() // 构建表单
      form.append('media', stream) // 添加文件
      const headers = await getHeaders(form)
      const res = await axios.post(url, form, { headers })
      ctx.body = res.data
    } catch (err) {
      throw new Error(err)
    }
  }

  // 人工审核
  async auditPost() {
    const { ctx, app } = this
    try {
      const { id, off } = ctx.request.body
      if (off) {
        // 删除
        await app.mysql.query(`UPDATE love_post SET off = 1 WHERE id = ?`, [id])
      } else {
        // 通过
        await app.mysql.query(`UPDATE love_post SET audit = 1 WHERE id = ?`, [id])
      }
      ctx.body = {}
    } catch (err) {
      throw new Error(err)
    }
  }
}

const getHeaders = (form) => {
  return new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) {
        reject(err)
      }
      const headers = Object.assign({ 'Content-Length': length }, form.getHeaders())
      resolve(headers)
    })
  })
}

module.exports = HomeController
