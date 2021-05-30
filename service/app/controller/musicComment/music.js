'use strict'
const axios = require('axios')
const shortid = require('shortid')
const API = require('./API')
const utils = require('../../utils/index')

const Controller = require('egg').Controller

class HomeController extends Controller {
  async getHotComments() {
    const { ctx, app } = this
    let result = await app.mysql.query(`SELECT c.*, s.name as songName, s.artistId, s.artistName FROM music_hotcomments c, music_songs s WHERE likedCount > 10000 AND c.songId = s.id LIMIT 100`)

    ctx.body = { data: result }
  }
}

module.exports = HomeController
