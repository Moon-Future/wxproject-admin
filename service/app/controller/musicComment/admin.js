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
    const { pageNo = 1, pageSize = 20 } = ctx.request.body
    const count = await app.mysql.query(`SELECT COUNT(*) as count FROM music_artist`)
    const data = await app.mysql.query(`SELECT * FROM music_artist LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)

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
    const { pageNo = 1, pageSize = 20 } = ctx.request.body
    const count = await app.mysql.query(`SELECT COUNT(*) as count FROM music_hotcomments`)
    const data = await app.mysql.query(`SELECT * FROM music_songs ORDER BY commentCount DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)

    ctx.body = { status: 200, data: data, count: count[0].count }
  }

  // 更新歌手歌曲数量
  async updateMusicSize() {
    const { ctx, app } = this
    const { artist, start = 0 } = ctx.request.body
    if (artist) {
      // 更新单个歌手
      
    } else {
      // 更新全部歌手

    }
  }
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
