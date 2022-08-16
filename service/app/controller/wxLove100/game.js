'use strict'
const shortid = require('shortid')
const { cosUpload } = require('../../utils/index')

const Controller = require('egg').Controller

const GAMES_TYPE = {
  Turntable: 'Turntable',
  Tiger: 'Tiger',
  UserRandom: 'UserRandom',
}

class HomeController extends Controller {
  async getGameParam() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { user } = ctx.request.body
      const resParam = await conn.query(`SELECT * FROM love100_game_param WHERE (user = ? OR user = ?) AND off != 1 ORDER BY create_time`, [user, 'system'])
      const resUsed = await conn.query(`SELECT * FROM love100_game_used WHERE user = ?`, [user])
      await conn.commit()
      ctx.body = { status: 1, param: resParam, used: resUsed }
    } catch (err) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }  
  } 

  async addGameParam() {
    const { ctx, app } = this
    const conn = await app.mysql.beginTransaction()
    try {
      const { user, gameType, prizeList, used, verbList, nounList } = ctx.request.body
      const param = { user, gameType, conn }
      if (gameType === GAMES_TYPE.Turntable) {
        // 转盘
        param.list = prizeList
        param.used = used
        await this.writeGameParam(param)
      } else if (gameType === GAMES_TYPE.Tiger) {
        // 老虎机
        param.list = verbList
        await this.writeGameParam(param)
        param.list = nounList
        await this.writeGameParam(param)
      }
      await conn.commit()
      ctx.body = { status: 1, message: '保存成功' }
    } catch (err) {
      await conn.rollback()
      console.log(e)
      ctx.body = { message: '服务端出错' }
    }
  }

  async writeGameParam(param) {
    let { user, gameType, conn, list, used } = param
    let field = ''
    for (let i = 0, len = list.length; i < len; i++) {
      let item = list[i]
      let id = ''
      field = item.field
      if (item.id) {
        // 更新
        id = item.id
        if (item.operate === 1) {
          // 更新
          await conn.query(`UPDATE love100_game_param set name = ?, update_time = ? WHERE id = ?`, [item.name, Date.now(), id])
        } else if (item.operate === 3) {
          // 删除
          await conn.query(`UPDATE love100_game_param set off = 1 WHERE id = ?`, [id])
        }
      } else {
        // 新增
        id = shortid()
        await conn.query(`INSERT INTO love100_game_param (id, name, user, field, type, create_time) VALUES (?, ?, ?, ?, ?, ?)`, [
          id,
          item.name,
          user,
          item.field,
          gameType,
          Date.now(),
        ])
        if (gameType === GAMES_TYPE.Turntable) {
          const index = used.indexOf(item.newId)
          used[index] = id
        }
      }
    }
    if (used && used.length) {
      field = 'prizeList'
      let res = await conn.query(`SELECT * FROM love100_game_used WHERE user = ? AND field = ?`, [user, field])
      if (res.length) {
        await conn.query(`UPDATE love100_game_used set used = ? WHERE id = ? AND field = ?`, [used.join(','), res[0].id, field])
      } else {
        await conn.query(`INSERT INTO love100_game_used (id, user, used, field) VALUES (?, ?, ?, ?)`, [shortid(), user, used.join(','), field])
      }
    }
  }
}

module.exports = HomeController
