'use strict'
const { cosUpload, dateFormat } = require('../../utils/index')
const shortid = require('shortid')
const { transporter, mailOptions } = require('../../utils/email')
const { tencentCloud } = require('../../../config/secret')

const Controller = require('egg').Controller

class HomeController extends Controller {
  async getPost() {
    const { ctx, app } = this
    try {
      const { type, pageSize, pageNum, user } = ctx.request.body
      let count = [{ count: 0 }],
        result = []
      if (type === 'all') {
        count = await app.mysql.query(
          `SELECT COUNT(*) as count FROM love_post WHERE hide != 1 AND off != 1 AND (audit != 0 OR (audit = 0 AND user = ?))`,
          [user]
        )
        result = await app.mysql.query(
          `SELECT p.*, u.avatar, u.nickname FROM love_post p, love_user u WHERE p.user = u.id AND p.hide != 1 AND p.off != 1 AND (p.audit != 0 OR (p.audit = 0 AND p.user = ?)) ORDER BY p.time DESC LIMIT ${
            (pageNum - 1) * pageSize
          }, ${pageSize}`,
          [user]
        )
      } else if (type === 'like') {
        if (user) {
          count = await app.mysql.query(`SELECT COUNT(*) as count FROM love_liked WHERE user = ? AND type = 1`, [user])
          result = await app.mysql.query(
            `SELECT p.*, u.avatar, u.nickname FROM love_post p, love_user u, love_liked l WHERE l.user = ? AND l.type = 1 AND l.likedId = p.id AND p.user = u.id AND p.hide != 1 AND p.off != 1 ORDER BY p.time DESC`,
            [user]
          )
        }
      } else if (type === 'my') {
        if (user) {
          count = await app.mysql.query(`SELECT COUNT(*) as count FROM love_post WHERE user = ? AND off != 1`, [user])
          result = await app.mysql.query(
            `SELECT p.*, u.avatar, u.nickname FROM love_post p, love_user u WHERE p.user = ? AND p.user = u.id AND p.off != 1 ORDER BY p.time DESC`,
            [user]
          )
        }
      } else if (type === 'audit') {
        // 待审核
        count = await app.mysql.query(`SELECT COUNT(*) as count FROM love_post WHERE audit = 0 AND off != 1`)
        result = await app.mysql.query(
          `SELECT p.*, u.avatar, u.nickname FROM love_post p, love_user u WHERE p.audit = 0 AND p.user = u.id AND p.off != 1 ORDER BY p.time DESC`
        )
      }
      result.forEach((ele) => {
        if (ele.noname == 1) {
          ele.avatar = ''
        }
      })
      ctx.body = { data: result, count: count[0].count }
    } catch (err) {
      throw new Error(err)
    }
  }

  async writePost() {
    const { ctx, app } = this
    try {
      const { user, title, content, noname, hide, images } = ctx.request.body
      const id = shortid()
      const summary = content.substr(0, 100) + (content.length > 100 ? '...' : '')
      await app.mysql.query(
        `INSERT INTO love_post (id, user, title, content, summary, noname, hide, time, images, audit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, user, title, content, summary, noname, hide, Date.now(), images, 0]
      )
      ctx.body = { postId: id }
      mailOptions.subject = `失恋营地-新发帖`
      mailOptions.html = `
          <h1>有人发帖啦~<h1>
          <p>标题: ${title}</p>
          <p>内容: ${content}</p>
          <p>时间：${dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')}</p>
        `
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error)
        }
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  async postDetail() {
    const { ctx, app } = this
    try {
      const { id, user } = ctx.request.body
      const result = await app.mysql.query(`SELECT p.*, u.avatar, u.nickname FROM love_post p, love_user u WHERE p.user = u.id AND p.id = ?`, [id])
      // 详情，登录的当前用户是否点赞
      let liked = false
      if (user) {
        const likedRes = await app.mysql.query(`SELECT * FROM love_liked WHERE type = ? AND likedId = ? AND user = ?`, [1, id, user])
        if (likedRes && likedRes.length) {
          liked = true
        }
      }
      result.forEach((ele) => {
        if (ele.noname == 1) {
          ele.avatar = ''
        }
        ele.userLiked = liked
      })
      ctx.body = result[0]
    } catch (err) {
      throw new Error(err)
    }
  }

  async writeComment() {
    const { ctx, app } = this
    try {
      const { post, content, user, reply1, reply2, userInfo } = ctx.request.body
      const postResult = await app.mysql.query(`SELECT * FROM love_post WHERE id = ?`, [post])
      const id = shortid()
      await app.mysql.query(`INSERT INTO love_comment (id, post, user, time, content, reply1, reply2) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        id,
        post,
        user,
        Date.now(),
        content,
        reply1,
        reply2,
      ])
      await app.mysql.query(`UPDATE love_post SET comment = ? WHERE id = ?`, [postResult[0].comment + 1, post])
      ctx.body = {
        avatar: userInfo.avatarUrl,
        content: content,
        id: id,
        liked: 0,
        nickname: userInfo.nickName,
        post: post,
        reply1: reply1,
        reply2: reply2,
        time: Date.now(),
        user: userInfo.userId,
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async getComment() {
    const { ctx, app } = this
    try {
      const { post } = ctx.request.body
      const result = await app.mysql.query(
        `SELECT c.*, u.avatar, u.nickname FROM love_comment c, love_user u WHERE c.user = u.id AND c.post = ? ORDER BY c.time`,
        [post]
      )
      ctx.body = result
    } catch (err) {
      throw new Error(err)
    }
  }

  async liked() {
    const { ctx, app } = this
    try {
      const { liked, type, user, off } = ctx.request.body
      if (off) {
        await app.mysql.query(`DELETE FROM love_liked WHERE likedId = ?`, [liked])
        if (type == 1) {
          const postResult = await app.mysql.query(`SELECT * FROM love_post WHERE id = ?`, [liked])
          await app.mysql.query(`UPDATE love_post SET liked = ? WHERE id = ?`, [postResult[0].liked - 1, liked])
        } else {
          const commentResult = await app.mysql.query(`SELECT * FROM love_comment WHERE id = ?`, [liked])
          await app.mysql.query(`UPDATE love_comment SET liked = ? WHERE id = ?`, [commentResult[0].liked - 1, liked])
        }
        ctx.body = {}
        return
      }
      const id = shortid()
      await app.mysql.query(`INSERT INTO love_liked (id, type, likedId, user, time) VALUES (?, ?, ?, ?, ?)`, [id, type, liked, user, Date.now()])
      if (type == 1) {
        const postResult = await app.mysql.query(`SELECT * FROM love_post WHERE id = ?`, [liked])
        await app.mysql.query(`UPDATE love_post SET liked = ? WHERE id = ?`, [postResult[0].liked + 1, liked])
      } else {
        const commentResult = await app.mysql.query(`SELECT * FROM love_comment WHERE id = ?`, [liked])
        await app.mysql.query(`UPDATE love_comment SET liked = ? WHERE id = ?`, [commentResult[0].liked + 1, liked])
      }
      ctx.body = {}
    } catch (err) {
      throw new Error(err)
    }
  }

  async getLiked() {
    const { ctx, app } = this
    try {
      const { type, user } = ctx.request.body
      const result = await app.mysql.query(`SELECT * FROM love_liked WHERE type = ? AND user = ?`, [type, user])
      ctx.body = result
    } catch (err) {
      throw new Error(err)
    }
  }

  async upLoad() {
    const { ctx, app } = this
    try {
      let file = ctx.request.files[0]
      let { filename, filepath } = file
      const result = await cosUpload('post/' + shortid() + filename.substr(filename.lastIndexOf('.')), filepath, tencentCloud.missLove)
      ctx.body = { imageSrc: result.Location }
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = HomeController
