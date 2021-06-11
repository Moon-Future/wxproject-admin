'use strict'
const axios = require('axios')
const shortid = require('shortid')
const API = require('./API')
const utils = require('../../utils/index')

const Controller = require('egg').Controller

class HomeController extends Controller {
  // 歌手
  async getArtist() {
    const { ctx, app } = this
    const { name, pageNo = 1, pageSize = 20 } = ctx.request.body
    let count, data
    if (name === '' || name === undefined) {
      count = await app.mysql.query(`SELECT COUNT(*) as count FROM music_artist`)
      data = await app.mysql.query(`SELECT * FROM music_artist LIMIT ?, ?`, [(pageNo - 1) * pageSize, pageSize])
    } else {
      count = await app.mysql.query(`SELECT COUNT(*) as count FROM music_artist WHERE name LIKE '%${name}%'`)
      data = await app.mysql.query(`SELECT * FROM music_artist WHERE name LIKE '%${name}%' LIMIT ?, ?`, [(pageNo - 1) * pageSize, pageSize])
    }
    ctx.body = { status: 200, data: data, count: count[0].count }
  }

  async getHotComment() {
    const { ctx, app } = this
    const { pageNo = 1, pageSize = 20 } = ctx.request.body
    const count = await app.mysql.query(`SELECT COUNT(*) as count FROM music_hotcomments`)
    const data = await app.mysql.query(`SELECT c.*, s.name as songName, s.artistId, s.artistName 
      FROM music_hotcomments c, music_songs s 
      WHERE c.songId = s.id ORDER BY c.likedCount DESC LIMIT ?, ?`, [(pageNo - 1) * pageSize, pageSize])
    ctx.body = { status: 200, data: data, count: count[0].count }
  }

  async getSong() {
    const { ctx, app } = this
    const { name, pageNo = 1, pageSize = 20 } = ctx.request.body
    let count, data
    if (name === '' || name === undefined) {
      count = await app.mysql.query(`SELECT COUNT(*) as count FROM music_songs`)
      data = await app.mysql.query(`SELECT * FROM music_songs ORDER BY commentCount DESC LIMIT ?, ?`, [(pageNo - 1) * pageSize, pageSize])
    } else {
      count = await app.mysql.query(`SELECT COUNT(*) as count FROM music_songs WHERE name LIKE '%${name}%'`)
      data = await app.mysql.query(`SELECT * FROM music_songs WHERE name LIKE '%${name}%' ORDER BY commentCount DESC LIMIT ?, ?`, [(pageNo - 1) * pageSize, pageSize])
    }
    ctx.body = { status: 200, data: data, count: count[0].count }
  }

  // 更新歌手歌曲数量
  async updateMusicSize() {
    try {
      const { ctx, app } = this
      const { artist = '', start = 0 } = ctx.request.body
      let data
      if (artist) {
        // 更新单个歌手
        data = await API.getSongs(artist, 1)
        await app.mysql.query(`UPDATE music_artist SET musicSize = ? WHERE id = ?`, [data.total, artist])
      } else {
        // 更新全部歌手
        
      }
      ctx.body = { status: 200, data: data.total }
    } catch (error) {
      throw new Error(error)
    }
  }

  // 更新歌曲评论数
  async updateCommentCount() {
    try {
      const { ctx, app } = this
      const { id = '', start = 0 } = ctx.request.body
      let total
      if (id) {
        // 更新单个歌手
        total = await API.getCommentCount(id)
        await app.mysql.query(`UPDATE music_songs SET commentCount = ? WHERE id = ?`, [total, id])
      } else {
        // 更新全部歌手
        
      }
      ctx.body = { status: 200, data: total }
    } catch (error) {
      throw new Error(error)
    }
  }

  // 更新评论点赞数
  async updateCommentLikedCount() {
    try {
      const { ctx, app } = this
      const { commentId = '', songId = '', startIndex, endIndex } = ctx.request.body
      if (startIndex) {
        let result = await app.mysql.query(`SELECT * FROM music_hotcomments ORDER BY likedCount DESC LIMIT ?, ?`, [startIndex - 1, endIndex - startIndex])
        this.musicCommentLikeCount = { startIndex, i: 0 }
        try {
          await startUpdate(app, 2)
          for (let item of result) {
            if (!this.musicCommentLikeCount) {
              ctx.body = { status: 200, data: '停止更新' }
            }
            let { id, songId } = item
            let total = await API.getLikedCount(id, songId)
            await app.mysql.query(`UPDATE music_hotcomments SET likedCount = ? WHERE id = ?`, [total, id])
            this.musicCommentLikeCount.i++
          }
          await stopUpdate(app, this.musicCommentLikeCount, 2)
          ctx.body = { status: 200, data: '完成更新' }
        } catch (error) {
          await stopUpdate(app, this.musicCommentLikeCount, 2)
          throw new Error(error)
        }
      } else {
        let total = await API.getLikedCount(commentId, songId)
        await app.mysql.query(`UPDATE music_hotcomments SET likedCount = ? WHERE id = ?`, [total, commentId])
        ctx.body = { status: 200, data: total }
      }
    } catch (error) {
      throw new Error(error)
    }
  }


  // 获取更新记录
  async getUpdateHistory() {
    try {
      const { ctx, app } = this
      const { type = 0 } = ctx.request.body
      const result = await app.mysql.query(`SELECT * FROM music_update WHERE type = ?`, [type])
      if (result.length === 0) {
        let data = {
          id: shortid(), type, time: Date.now(), startIndex: 0, endIndex: 0, doing: 0
        }
        result.push(data)
        await app.mysql.query(`INSERT INTO music_update (id, type, time, startIndex, endIndex, doing) VALUES (?, ?, ?, ?, ?, ?)`, 
        [data.id, data.type, data.time, data.startIndex, data.endIndex, data.doing])
      }
      ctx.body = { status: 200, data: result[0] }
    } catch (error) {
      throw new Error(error)
    }
  }

  async stopUpdate() {
    const { ctx, app } = this
    const { type = 0 } = ctx.request.body
    await stopUpdate(app, this.musicCommentLikeCount, type)
  }
}

async function startUpdate(app, type = 0) {
  await app.mysql.query(`UPDATE music_update SET doing = ? WHERE type = ?`, [1, type])
}

async function stopUpdate(app, params, type = 0) {
  await app.mysql.query(`UPDATE music_update SET time = ?, startIndex = ?, endIndex = ?, doing = ? WHERE type = ?`, 
    [Date.now(), params.startIndex, params.startIndex + params.i, 0, type]) 
  params = null
}

// 过滤 Emoji
function filteremoji(str){
  var ranges = [
      '\ud83c[\udf00-\udfff]', 
      '\ud83d[\udc00-\ude4f]', 
      '\ud83d[\ude80-\udeff]'
  ]
  return str.replace(new RegExp(ranges.join('|'), 'g'), '')
}

module.exports = HomeController
