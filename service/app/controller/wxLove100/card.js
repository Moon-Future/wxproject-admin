'use strict'
const shortid = require('shortid')
const Controller = require('egg').Controller

class HomeController extends Controller {
  async getCardList() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { common, user } = ctx.request.body
      let cardList = await conn.query(`SELECT * FROM love100_card WHERE verify = ? AND off = ? AND (ISNULL(user) OR user = ?) ORDER BY date`, [1, 0, user])
      let finishedList = []
      if (common) {
        finishedList = await conn.query(`SELECT * FROM love100_finished WHERE common = ? AND off != 1`, [common])
      }
      await conn.commit()
      ctx.body = { status: 1, cardList: cardList, finishedList: finishedList }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async cardFinished() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { cardId, common, adr, date, userInfo, cardTitle } = ctx.request.body
      const result = await conn.query(`SELECT * FROM love100_lover WHERE common = ? AND off != 1`, [common])
      if (!result.length) {
        ctx.body = { status: 0, message: '请邀请对象一起完成哦~' }
        return
      }
      let finishedId = ''
      const finishDelete = await conn.query(`SELECT * FROM love100_finished WHERE common = ? AND cardId = ?`, [common, cardId])
      if (finishDelete.length) {
        finishedId = finishDelete[0].id
        await conn.query(`UPDATE love100_finished SET adr = ?, date = ?, off = 0 WHERE id = ?`, [adr, date, finishedId])
      } else {
        finishedId = shortid()
        await conn.query(`INSERT INTO love100_finished (id, common, adr, date, cardId, off) VALUES (?, ?, ?, ?, ?, 0)`,
          [finishedId, common, adr, date, cardId])
      }

      const time = Date.now()
      await conn.query(`INSERT INTO love100_message (id, title, content, userId, fromId, date, reador) VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)`, 
        [shortid(), '一路有你', `${userInfo.nickName}和您共同完成了【${cardTitle}】`, userInfo.lover, 'system', time, 0,
          shortid(), '一路有你', `您和${userInfo.loverNickName}共同完成了【${cardTitle}】`, userInfo.id, 'system', time, 1
        ])

      await conn.commit()
      ctx.body = { status: 1, finishedId: finishedId }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async cardEdit() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { common, adr, date, finishedId, delFlag = false, userInfo, cardTitle } = ctx.request.body
      const result = await conn.query(`SELECT * FROM love100_lover WHERE common = ? AND off != 1`, [common])
      if (!result.length) {
        ctx.body = { status: 0, message: '请邀请对象一起完成哦~' }
        return
      }
      await conn.query(`UPDATE love100_finished SET adr = ?, date = ?, off = ? WHERE id = ?`,
        [adr, date, delFlag ? 1 : 0, finishedId])

      const time = Date.now()
      if (delFlag) {
        await conn.query(`INSERT INTO love100_message (id, title, content, userId, fromId, date, reador) VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)`, 
          [shortid(), '一路有你', `${userInfo.nickName}取消了已完成事件【${cardTitle}】`, userInfo.lover, 'system', time, 0,
            shortid(), '一路有你', `您取消了已完成事件【${cardTitle}】`, userInfo.id, 'system', time, 1
          ])
      }
      
      await conn.commit()
      ctx.body = { status: 1, finishedId: finishedId }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async getSentence() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const result = await conn.query(`SELECT * from love100_sentence WHERE off != 1 ORDER BY rand() LIMIT 1 `)
      await conn.commit()
      ctx.body = { status: 1, data: result.length ? result[0].content : '' }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  // 用户上传事件
  async cardAdd() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const defaultUrl = 'https://love100-1255423800.cos.ap-shanghai.myqcloud.com/upload%2Fcard%2Fdefault.jpeg'
      let { title, url, user, id } = ctx.request.body
      if (!user) {
        ctx.body = { status: 0, message: '请先登录' }
        return
      }
      if (url === '') {
        url = defaultUrl
      }
      if (id) {
        // 编辑
        const result = await conn.query(`SELECT * FROM love100_card WHERE id = ?`, [id])
        await conn.query(`UPDATE love100_card SET id = ?, off = 1 WHERE id = ?`, [`update_${shortid()}_${id}`, id])
        let obj = result[0]
        await conn.query(`INSERT INTO love100_card (id, title, url, user, verify, date, updateDate) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
            [id, title, url, obj.user, 1, obj.date, Date.now()])
        await conn.commit()
        obj.title = title
        obj.url = url
        ctx.body = { status: 1, message: '更新成功', data: obj }
      } else {
        // 新增
        const newId = shortid()
        await conn.query(`INSERT INTO love100_card (id, title, url, user, verify, date) VALUES (?, ?, ?, ?, ?, ?)`, 
            [newId, title, url, user, 1, Date.now()])
        const result = await conn.query(`SELECT * FROM love100_card WHERE id = ?`, [newId])
        await conn.commit()
        ctx.body = { status: 1, message: '提交成功', data: result[0] }
      }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  // 删除上传的事件
  async cardDelete() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      let { user, id } = ctx.request.body
      if (!user) {
        ctx.body = { status: 0, message: '请先登录' }
        return
      }
      await conn.query(`UPDATE love100_card SET off = 1 WHERE id = ?`, [id])
      await conn.commit()
      ctx.body = { status: 1, message: '删除成功', data: {} }
    } catch(e) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }
}

module.exports = HomeController
