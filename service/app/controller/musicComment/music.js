'use strict'
const axios = require('axios')
const shortid = require('shortid')
const API = require('./API')
const utils = require('../../utils/index')

const Controller = require('egg').Controller

class HomeController extends Controller {
  async getHotComments() {
    const { ctx, app } = this
    try {
      const { pageNo = 1, pageSize = 20 } = ctx.request.body
      let total = await app.mysql.query(`SELECT COUNT(*) as total FROM music_hotcomments`)
      let result = await app.mysql.query(`SELECT c.*, s.name as songName, s.artistId, s.artistName 
        FROM music_hotcomments c, music_songs s 
        WHERE c.songId = s.id ORDER BY c.likedCount DESC LIMIT ?, ?`, [(pageNo - 1) * pageSize, pageSize])
      ctx.body = { status: 200, data: result, total: total[0].total }
    } catch (error) {
      throw new Error(error)
    }
  }

  async getHotMusic() {
    const { ctx, app } = this
    try {
      const { pageNo = 1, pageSize = 20 } = ctx.request.body
      let total = await app.mysql.query(`SELECT COUNT(*) as total FROM music_songs`)
      let result = await app.mysql.query(`SELECT s.*, a.picUrl as avatar 
        FROM music_songs s, music_artist a 
        WHERE s.artistId = a.id AND s.commentCount > 10000 ORDER BY s.commentCount DESC LIMIT ?, ?`, [(pageNo - 1) * pageSize, pageSize])
      ctx.body = { status: 200, data: result, total: total[0].total }
    } catch (error) {
      throw new Error(error)
    }
  }

  async getLyric() {
    const { ctx, app } = this
    const lyric = await API.getLyric('411214279')
    ctx.body = { lyric }
  }

  async getSongInfo() {
    const { ctx, app } = this
    try {
      const { songId } = ctx.request.body
      const songInfo = await app.mysql.query(`SELECT s.*, a.picUrl as avatar FROM music_songs s, music_artist a WHERE s.artistId = a.id AND s.id = ?`, [songId])
      if (songInfo.length === 0) {
        ctx.body = { status: 400, message: '未找到歌曲' }
        return
      } 
      const lyric = await API.getLyric(songId)
      songInfo[0].lyric = lyric
      ctx.body = { status: 200, data: songInfo[0] }
    } catch (err) {
      throw new Error(err)
    }
  }

  async getComments() {
    const { ctx, app } = this
    try {
      const { songId, pageNo, pageSize } = ctx.request.body
      let comments = await API.getComments(songId, pageNo, pageSize, 3)

      ctx.body = { status: 200, data: songInfo[0] }
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = HomeController
