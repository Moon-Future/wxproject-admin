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
