'use strict'
const shortid = require('shortid')
const { dateFormat } = require('../../utils/index')
const { transporter, mailOptions } = require('../../utils/email')

const Controller = require('egg').Controller

class HomeController extends Controller {
  async suggest() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { typeItem, content, contact, user } = ctx.request.body
      const date = Date.now()
      await conn.query(`INSERT love100_suggest (id, typeId, typeName, content, contact, user, date) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [shortid(), typeItem.id, typeItem.name, content, contact, user, date])

      mailOptions.subject = `情侣100件事-问题反馈`
      mailOptions.html = `
        <h1>用户有问题反馈啦~<h1>
        <p>分类: ${typeItem.name}</p>
        <p>反馈: ${content}</p>
        <p>联系方式：${contact}</p>
        <p>时间：${dateFormat(date, 'yyyy-MM-dd hh:mm:ss')}</p>
      `
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error)
        }
      })

      await conn.commit()
      ctx.body = { status: 1, message: '感谢您的宝贵意见~' }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async writeLog() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { user, log } = ctx.request.body
      const date = Date.now()
      await conn.query(`INSERT love100_log (id, user, json_txt, create_time) VALUES (?, ?, ?, ?)`, 
        [shortid(), user, JSON.stringify(log), Date.now()])
      await conn.commit()
      ctx.body = { status: 1 }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
