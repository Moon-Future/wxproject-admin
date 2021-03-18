'use strict'
const shortid = require('shortid')

const Controller = require('egg').Controller

class HomeController extends Controller {
  async writeStory() {
    const { ctx, app } = this
    try {
      const { user, code, time, mark, storyId, off } = ctx.request.body
      if (off) {
        await app.mysql.query(`UPDATE love_story SET off = 1 WHERE id = ?`, [storyId])
      } else {
        if (storyId) {
          await app.mysql.query(`UPDATE love_story SET code = ?, time = ?, mark = ? WHERE id = ?`, [code, time, mark, storyId])
        } else {
          const id = shortid()
          await app.mysql.query(`INSERT INTO love_story (id, user, code, time, mark, addtime) VALUES (?, ?, ?, ?, ?, ?)`, [
            id,
            user,
            code,
            time,
            mark,
            Date.now(),
          ])
        }
      }
      ctx.body = {}
    } catch (err) {
      throw new Error(err)
    }
  }

  async getStory() {
    const { ctx, app } = this
    try {
      const { user } = ctx.request.body
      const result = await app.mysql.query(`SELECT * FROM love_story WHERE user = ? AND off != 1 ORDER BY addtime`, [user])
      ctx.body = result
    } catch (err) {
      throw new Error(err)
    }
  }

  async suggest() {
    const { ctx, app } = this
    try {
      const { content, user } = ctx.request.body
      await app.mysql.query(`INSERT INTO love_suggest (id, content, user, time) VALUES (?, ?, ?, ?)`, [shortid(), content, user, Date.now()])
      ctx.body = {}
    } catch (err) {
      throw new Error(err)
    }
  }

  async updateUser() {
    const { ctx, app } = this
    try {
      const { userInfo, user } = ctx.request.body
      await app.mysql.query(`UPDATE love_user SET avatar = ?, nickname = ?, gender = ?, country = ?, province = ?, city = ? WHERE id = ?`, [
        userInfo.avatarUrl,
        userInfo.nickName,
        userInfo.gender,
        userInfo.country,
        userInfo.province,
        userInfo.city,
        user,
      ])
      ctx.body = {}
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = HomeController
