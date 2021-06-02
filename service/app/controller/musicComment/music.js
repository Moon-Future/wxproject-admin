'use strict'
const axios = require('axios')
const shortid = require('shortid')
const API = require('./API')
const utils = require('../../utils/index')

const Controller = require('egg').Controller

class HomeController extends Controller {
  async getHotComments() {
    const { ctx, app } = this
    let result = await app.mysql.query(`SELECT c.*, s.name as songName, s.artistId, s.artistName FROM music_hotcomments c, music_songs s WHERE c.likedCount > 10000 AND c.songId = s.id ORDER BY c.likedCount DESC LIMIT 20`)

    ctx.body = { data: result }
  }

  async getHotMusic() {
    const { ctx, app } = this
    let result = await app.mysql.query(`SELECT s.*, a.picUrl as avatar FROM music_songs s, music_artist a WHERE s.artistId = a.id ORDER BY s.commentCount DESC LIMIT 20`)

    ctx.body = { data: result }
  }
}

module.exports = HomeController
